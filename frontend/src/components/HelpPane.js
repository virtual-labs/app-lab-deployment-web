import MarkdownPreview from "@uiw/react-markdown-preview";
import "../css/App.css";

const HelpPane = ({ help, setViewHelp }) => {
  let markdownContent = help;

  const replaceImagePaths = (markdownContent, repoOwner, repoName, branch) => {
    const regex = /(!\[(.*?)\]\((.*?)\))|(<img\s+src="(.*?)"\s*\/?>)/g;
    const baseUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/docs/`;

    return markdownContent.replace(
      regex,
      (
        match,
        markdownImage,
        altText,
        markdownImagePath,
        htmlImage,
        imagePath
      ) => {
        const imagePathToUse = markdownImagePath || imagePath; // Choose the correct image path

        if (imagePathToUse.startsWith(".")) {
          return markdownImage
            ? `![${altText}](${baseUrl}${imagePathToUse.substring(2)})`
            : `<img src="${baseUrl}${imagePathToUse.substring(2)}">`;
        }

        return match;
      }
    );
  };

  markdownContent = replaceImagePaths(
    markdownContent,
    "virtual-labs",
    "app-lab-deployment-web",
    "dev"
  );

  console.log("***", markdownContent);

  return (
    <div className="host-req absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 h-full flex items-center justify-center z-1150">
      <div className="flex flex-col bg-white h-4/5 w-4/5 add-lab-container p-2">
        <div className="flex flex-row justify-end">
          <span
            className="text-2xl cursor-pointer hover:text-red-600 active:text-red-800"
            onClick={() => setViewHelp(false)}
          >
            &times;
          </span>
        </div>
        <div className="h-100 overflow-auto">
          <MarkdownPreview
            wrapperElement={{
              "data-color-mode": "light",
            }}
            source={markdownContent}
            style={{ padding: 16 }}
          />
        </div>
        <div className="flex w-full justify-center p-2">
          <span className="mr-1">Contact us @</span>
          <a
            href="mailto:support@vlabs.ac.in"
            className="text-blue-600 underline hover:text-blue-800 transition-all duration-300"
          >
            {" support@vlabs.ac.in"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpPane;
