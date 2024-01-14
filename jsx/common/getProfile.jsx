// #include "./json2.js";

function getProfile () {
	var doc = app.activeDocument;
	return {
		cmyk: doc.cmykProfile,
		rgb: doc.rgbProfile,
        currentWorkinRGB: app.colorSettings.workingSpaceRGB,
        currentWorkingCMYK: app.colorSettings.workingSpaceCMYK,
        name: app.activeDocument.name,
        status: "success"
	}
}

function getDocStatus () {
    try {
        if (app.documents.length < 1)throw new Error("there isn't any open document");
        return JSON.stringify(getProfile());
    } catch (e) {
        return JSON.stringify(
            {
                status: "failed",
                msg: e.message
            }
        )
    }
}

// $.writeln(hostScript ());