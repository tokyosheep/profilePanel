function getProfile () {
	var doc = app.activeDocument;
	return {
		cmyk: doc.cmykProfile,
		rgb: doc.rgbProfile,
        name: app.activeDocument.name,
        status: "success"
	}
}

function hostScript () {
    try {
        if (app.documents.length < 1)throw new Error("ドキュメントが開かれていません");
        return JSON.stringify(getProfile());
    } catch (e) {
        return JSON.stringify(
            {
                status: "failed"
            }
        )
    }
}
