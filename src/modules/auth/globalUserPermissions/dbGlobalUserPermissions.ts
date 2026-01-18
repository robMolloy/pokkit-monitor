import z from "zod";
import type { PocketBase } from "../pocketbaseTypeHelpers";

const collectionName = "globalUserPermissions";

export const globalUserPermissionsSchema = z.object({
  collectionId: z.string(),
  collectionName: z.literal(collectionName),
  id: z.string(),
  status: z.enum(["pending", "approved", "blocked"]),
  role: z.enum(["standard", "admin"]),
});

export type TGlobalUserPermissions = z.infer<typeof globalUserPermissionsSchema>;

export const getGlobalUserPermissions = async (p: { pb: PocketBase; id: string }) => {
  try {
    const globalUserPermissionsResp = await p.pb.collection(collectionName).getOne(p.id);
    return globalUserPermissionsSchema.safeParse(globalUserPermissionsResp);
  } catch (e) {
    const error = e as { message: string };
    return { success: false, error } as const;
  }
};

export const subscribeToUserGlobalUserPermissions = async (p: {
  pb: PocketBase;
  id: string;
  onChange: (e: TGlobalUserPermissions | null) => void;
}) => {
  try {
    const unsubPromise = p.pb.collection(collectionName).subscribe(p.id, (e) => {
      const parseResp = globalUserPermissionsSchema.safeParse(e.record);
      p.onChange(parseResp.success ? parseResp.data : null);
    });
    const globalUserPermissionsPromise = getGlobalUserPermissions(p);

    // subscription must be complete to avoid any race conditions issues
    // avoid using promises.all to be explicit
    const unsub = await unsubPromise;
    const globalUserPermissionsResp = await globalUserPermissionsPromise;

    p.onChange(globalUserPermissionsResp.success ? globalUserPermissionsResp.data : null);

    return { success: true, data: unsub } as const;
  } catch (error) {
    p.onChange(null);
    return { success: false, error } as const;
  }
};
