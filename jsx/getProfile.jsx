// #include "./json2.js";

function hasProfile (profile) {
    return profile === undefined ? "プロファイル無し" : profile;
}

function getProfile () {
	var doc = app.activeDocument;
	return {
		cmyk: hasProfile(doc.cmykProfile),
		rgb: hasProfile(doc.rgbProfile),
        currentWorkingRGB: (app.colorSettings.workingSpaceRGB),
        currentWorkingCMYK: app.colorSettings.workingSpaceCMYK,
        name: app.activeDocument.name,
        status: "success"
	}
}

function getDocStatus () {
    try {
        if (app.documents.length < 1) {
            return JSON.stringify({
                status: "success",
                currentWorkingRGB: app.colorSettings.workingSpaceRGB,
                currentWorkingCMYK: app.colorSettings.workingSpaceCMYK,
                name: null
            })
        }
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