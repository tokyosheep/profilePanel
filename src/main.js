const path = require("path");
const fs = require("fs");

const csInterface = new CSInterface();

const preventDragEvent = () =>{
    window.addEventListener("drop",prevent_dragnaddrop,false);
    
    window.addEventListener("dragover",prevent_dragnaddrop,false);
    
    function prevent_dragnaddrop(e){
        e.stopPropagation();
        e.preventDefault();
    }
};

const loadJsx = async (jsxFolder) =>{
    const parts = await fs.promises.readdir(jsxFolder);
    const jsxes = parts.filter(f => path.extname(f) === ".jsx" || path.extname(f) === ".js");
    jsxes.forEach(jsx =>  csInterface.evalScript(`$.evalFile("${jsxFolder}/${jsx}")`));
}

class ExtensionData {
	constructor () {
		const hostInfo = csInterface.getHostEnvironment();
		console.log(hostInfo);
		this.extensionId = csInterface.getExtensionID();
		this.appName = hostInfo.appName;
		this.appVer = hostInfo.appVersion;
		this.appMajorVer = Math.trunc(hostInfo.appVersion);
		this.localLan = hostInfo.appLocale;
		this.extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION);
	}
};

const hostData = new ExtensionData();

const callHostScript = () => {
	return new Promise((resolve) => {
	  csInterface.evalScript(`hostScript()`, (o) => {
		const json = JSON.parse(o);
		resolve(json);
	  });
	});
}

const detectDocumentChange = async () => {
	const result = await callHostScript();
	console.log(result);
	if (result.status === "success") {
		document.getElementById("rgb_data").textContent = result.rgb;
		document.getElementById("cmyk_data").textContent = result.cmyk;
		document.getElementById("doc_name").textContent = result.name;
	} else {
		document.getElementById("rgb_data").textContent = "none";
		document.getElementById("cmyk_data").textContent = "none";
		document.getElementById("doc_name").textContent = "";
	}
}

const registerEvent = () => {
	csInterface.addEventListener("documentEdited",(e)=>{
        console.log(e);
	});
	csInterface.addEventListener("documentAfterActivate", detectDocumentChange);
	csInterface.addEventListener("documentAfterSave", detectDocumentChange);
	document.getElementById("load_profile").addEventListener("click",  detectDocumentChange);
}

(async () => {
	themeManager.init();
	preventDragEvent();
	const commonFolder = path.join(hostData.extensionRoot, "jsx" ,"common");
	await Promise.all([commonFolder].map(async (folder) => {
        await loadJsx(folder);
    }));
	registerEvent();
	await detectDocumentChange();
})();