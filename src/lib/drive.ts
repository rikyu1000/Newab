spaces: "drive",
    });
return res.data.files[0];
};

export const createConfigFile = async (drive: any, initialContent: any[]) => {
    const fileMetadata = {
        name: FILE_NAME,
        mimeType: "application/json",
    };
    const media = {
        mimeType: "application/json",
        body: JSON.stringify(initialContent),
    };
    const res = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
    });
    return res.data;
};

export const getConfigFileContent = async (drive: any, fileId: string) => {
    const res = await drive.files.get({
        fileId: fileId,
        alt: "media",
    });
    return res.data;
};

export const updateConfigFile = async (
    drive: any,
    fileId: string,
    content: any[]
) => {
    const media = {
        mimeType: "application/json",
        body: JSON.stringify(content),
    };
    const res = await drive.files.update({
        fileId: fileId,
        media: media,
    });
    return res.data;
};
