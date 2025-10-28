import { Client } from "basic-ftp";
import { PassThrough } from "stream";
import { ADMIN_GROUP } from "@/app/(commons)/globals/constants";
import getSession from "@/app/(commons)/globals/session";
import db from "@database/db";

export async function GET(req: Request) {
  const session = await getSession();
  const url = new URL(req.url);
  const name = url.searchParams.get("name");
  const version = url.searchParams.get("version");
  const type = url.searchParams.get("type");

  if (!name || !version || !type) {
    return new Response("Invalid parameter!", { status: 400 });
  }

  // Check to permission
  let ipModelData;
  try {
    ipModelData = await db.iPModel.findUniqueOrThrow({
      where: {
        type: name,
        OR: [
          { ownerGroup: { name: session.dept } },
          { ownerGroup: { name: ADMIN_GROUP } },
        ],
      },
      include: {
        ownerGroup: true,
        _count: {
          select: {
            instances: true,
          },
        },
      },
    });

    if (
      ipModelData.ownerGroup.name !== ADMIN_GROUP &&
      ipModelData.ownerGroup.name !== session.dept
    ) {
      return new Response("Forbidden", { status: 403 });
    }
  } catch (e) {
    console.error(e);
    return new Response("Not found", { status: 404 });
  }

  // Stream a file
  const client = new Client();
  try {
    await client.access({
      host: process.env.NEXT_PUBLIC_FILE_SERVER_URL!,
      user: process.env.NEXT_PUBLIC_FILE_SERVER_ID!,
      password: process.env.NEXT_PUBLIC_FILE_SERVER_PW!,
      secure: false,
    });

    const remotePath = `/cmodel/${ipModelData.id}/${version}/${type}.so`;
    const pass = new PassThrough();
    const webStream = new ReadableStream({
      start(controller) {
        pass.on("data", (chunk) => controller.enqueue(chunk));
        pass.on("end", () => {
          controller.close();
          client.close();
        });
        pass.on("error", (err) => {
          controller.error(err);
          client.close();
        });
      },
      cancel() {
        pass.destroy();
        client.close();
      },
    });

    client.downloadTo(pass, remotePath).catch((err) => {
      console.error("FTP download error:", err);
      pass.destroy(err);
    });

    return new Response(webStream, {
      headers: {
        "Content-Disposition": `attachment; filename="${type}.so"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (err) {
    client.close();
    console.error(err);
    return new Response("Fail to download", { status: 500 });
  }
}
