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

//事前にExtendScriptを読み込む関数だがWin環境下での不具合のため現状使用してない。
const loadJsx = async (jsxFolder) =>{
    const parts = await fs.promises.readdir(jsxFolder);
    const jsxes = parts.filter(f => path.extname(f) === ".jsx" || path.extname(f) === ".js");
    jsxes.forEach(jsx =>  {
		try {
			console.log(path.join(jsxFolder,jsx));
			csInterface.evalScript(`$.evalFile("${path.join(jsxFolder,jsx)}")`);
		} catch (e) {
			console.log(e);
		}
	})
}

//なぜかWin環境下だと`$.evalFileメソッドが動かない
const initExtendScript = async () => {
	//node.jsではjsxフォルダーパスを読み込めるのでパスの問題ではなさそう。
	console.log(await fs.promises.readdir(path.join(hostData.extensionRoot, "jsx" ,"common")));
	const commonFolder = path.join(hostData.extensionRoot, "jsx" ,"common");
	const indesign = path.join(hostData.extensionRoot, "jsx" ,"indesign");
	await Promise.all([commonFolder, indesign].map(async (folder) => {
        await loadJsx(folder);
    }));
}

class ExtensionData {
	constructor () {
		const hostInfo = csInterface.getHostEnvironment();
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
	  csInterface.evalScript("hostScript()", (o) => {
		console.log(o);
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
	csInterface.addEventListener("documentAfterActivate", detectDocumentChange);
	csInterface.addEventListener("documentAfterSave", detectDocumentChange);
	document.getElementById("load_profile").addEventListener("click",  detectDocumentChange);
}

(async () => {
	themeManager.init();
	preventDragEvent();
	// initExtendScript Win環境下で動かないのでひとつのJSXにまとめた
	registerEvent();
	await detectDocumentChange();
})();