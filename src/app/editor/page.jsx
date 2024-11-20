"use client";
import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import {
  AiOutlinePlus,
  AiOutlineSave,
  AiOutlineCloseCircle,
} from "react-icons/ai";
//import officegen from 'officegen'
var SORTEDTOC;
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import {
  Button,
  Input,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemSuffix,
  Popover,
  PopoverHandler,
  PopoverContent,
  Card,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

import {
  updateDocument,
  getDocumentsByAuthor,
  getDocumentByAuthorAndTitle,
  deleteDocument,
} from "../api/Doc/route";

import Chat from "@/components/chat";
import CreateDocx from "../../pdfDocument/docxConvert";
import CreatePdf from "../../pdfDocument/pdfConvert";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

import {
  Header,
  NotionFinder,
  ToolBarButton,
  NodesCard,
  RichTextEditor,
} from "@/components/editorTools";
import axios from "axios";

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

//   getDocumentByAuthorAndTitle(email, filename)
//   .then(document => {
//     if (document) {
//       console.log("Document retrieved successfully:", document);
//     } else {
//       console.log("Document not found.");
//     }
//   })
//   .catch(error => {
//     console.error("An error occurred while retrieving the document:", error);
//   });

// deleteDocument(email, filename)
// .then(deletedDocument => {
//   console.log("Document deleted successfully:", deletedDocument);
// })
// .catch(error => {
//   console.error("An error occurred while deleting the document:", error);
// });
///////////////////////////////////////////////////////////////////////

async function addElementToDoc(currentFileName, sortedTOC) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch("/api/Doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: currentFileName,
          emptyTOC: sortedTOC,
          email: "fogangzacharietene@gmail.com",
        }),
      });

      resolve(true);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function CreationEditor() {
  //     let docx = officegen({
  //         type: 'docx', // We want to create a Microsoft Word document.
  //     })

  useEffect(() => {
    getDocumentsByAuthor("fogangzacharietene@gmail.com")
      .then((documents) => {
        console.log("Documents retrieved successfully:", documents);
      })
      .catch((error) => {
        console.error(
          "An error occurred while retrieving the documents:",
          error
        );
      });
  }, []);

  const [isModalActive, setIsModalActive] = useState(false);
  const [isNodeTitleModalActive, setIsNodeTitleActive] = useState(false);
  const [isNotionEditorActive, setIsNotionEditorActive] = useState(false);

  const [renderingHtml, setRenderingHtml] = useState("");

  const [tableOfContents, setTableOfcontents] = useState([
    {
      nodeType: "DOC",
      nodeTitle: "Titre de cours",
      nodeLevel: "Co0",
      parent: undefined,
      htmlContent: "",
      isClicked: false,
      isEnterPressed: false,
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [tableOfContentsComponents, setTableOfContentsComponents] = useState(
    []
  );
  const [selectedNode, setSelectedNode] = useState(null);
  const [enterPressedNotion, setEnterPressedNotion] = useState(null);

  //const sampleHTML = '<p>Alfred Hetsron Yepnjio</p><ul><li><strong>Sample</strong></li></ul><ol type="1"><li>you</li></ol><ul><li>content</li><li>state</li></ul><p></p>'
  const [htmlEditorContent, setHtmlEditorContent] = useState(null);
  const [newHTMLContent, setNewHTMLContent] = useState(null);
  const [defaultDraftHTML, setDefaultDraftHTML] = useState("");
  const [jsonEditorContent, setJsonEditorContent] = useState(null);

  const [addNodeOptions, setAddNodeOptions] = useState([]);
  const [addNodeInfo, setAddNodeInfo] = useState(null);
  const [addNodeTitle, setAddNodeTitle] = useState("");

  const targetHTMLParseRef = useRef(null);

  const handlecloseEditor = () => {
    updateNotionHTMLInTOC(DOMPurify.sanitize(htmlEditorContent));
    setIsNotionEditorActive(false);
  };
  const parseStringToHTML = (htmlString) => {
    const parser = new DOMParser();
    const parsedHTML = parser.parseFromString(htmlString, "text/html");
    return parsedHTML.body;
  };

  const setEnterPressNotionInTOC = (nodeInfo) => {
    setEnterPressedNotion(nodeInfo);
    // console.log(nodeInfo.htmlContent);
    setDefaultDraftHTML(nodeInfo.htmlContent);
    if (nodeInfo) {
      let tempTOC = [...tableOfContents];
      setTableOfcontents([]);
      tempTOC[nodeInfo.index].isClicked = nodeInfo.isClicked;
      tempTOC[nodeInfo.index].isEnterPressed = nodeInfo.isEnterPressed;
      setTableOfcontents(tempTOC);

      /* We Display the Editor if all condiions satisfy*/
      setIsNotionEditorActive(true);
    }
  };

  const setSelectedNodeInTOC = (nodeInfo) => {
    setSelectedNode(nodeInfo);
    if (nodeInfo) {
      let tempTOC = [...tableOfContents];
      setTableOfcontents([]);
      tempTOC[nodeInfo.index].isClicked = nodeInfo.isClicked;
      tempTOC[nodeInfo.index].isEnterPressed = nodeInfo.isEnterPressed;
      setTableOfcontents(tempTOC);
    }
  };

  const updateEditedNodeTitle = (nodeInfo) => {
    if (nodeInfo) {
      setSelectedNode(nodeInfo);
      let tempTOC = [...tableOfContents];
      setTableOfcontents([]);
      tempTOC[nodeInfo.index].nodeTitle = nodeInfo.nodeTitle;
      setTableOfcontents(tempTOC);
    }
  };

  const updateNotionHTMLInTOC = (htmlString) => {
    let tempTOC = [...tableOfContents];
    setTableOfcontents([]);
    tempTOC[enterPressedNotion.index].htmlContent = htmlString;
    setTableOfcontents(tempTOC);
  };

  const setAddNodeTypes = (selectedNode) => {
    switch (selectedNode.nodeType) {
      case "DOC":
        setAddNodeOptions([
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            nodeColor: "#E2EBF9",
            textColor: "#4285F4",
          },
          {
            nodeType: "PARAGRAPH",
            nodeInitial: "Pr",
            nodeColor: "#EA4335",
            textColor: "white",
          },
          {
            nodeType: "PART",
            nodeInitial: "Pt",
            nodeColor: "#34A853",
            textColor: "white",
          },
        ]);
        break;
      case "PART":
        setAddNodeOptions([
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            nodeColor: "#E2EBF9",
            textColor: "#4285F4",
          },
          {
            nodeType: "PARAGRAPH",
            nodeInitial: "Pr",
            nodeColor: "#EA4335",
            textColor: "white",
          },
          {
            nodeType: "CHAPTER",
            nodeInitial: "Ch",
            nodeColor: "#FBBC05",
            textColor: "white",
          },
        ]);
        break;
      case "CHAPTER":
        setAddNodeOptions([
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            nodeColor: "#E2EBF9",
            textColor: "#4285F4",
          },
          {
            nodeType: "PARAGRAPH",
            nodeInitial: "Pr",
            nodeColor: "#EA4335",
            textColor: "white",
          },
        ]);
        break;
      case "PARAGRAPH":
        setAddNodeOptions([
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            nodeColor: "#E2EBF9",
            textColor: "#4285F4",
          },
        ]);
        break;
      default:
        setAddNodeOptions([
          {
            nodeType: "NOTION",
            nodeInitial: "No",
            nodeColor: "#E2EBF9",
            textColor: "#4285F4",
          },
        ]);
        break;
    }
  };

  // const getInitialFromNodeType = (nodeType) => {
  //     switch(nodeType){
  //         case 'DOC':
  //             return 'Co'
  //             break
  //         case 'PART':
  //             return 'Pt'
  //             break
  //         case 'CHAPTER':
  //             return 'Ch'
  //             break
  //         case 'PARAGRAPH':
  //             return 'Pr'
  //             break
  //         case 'NOTION':
  //             return 'No'
  //             break
  //         default:
  //             return 'Co'
  //     }
  // }

  const insertElementAtPosition = (array, element, index) => {
    const newArray = [...array];
    newArray.splice(index, 0, element);
    return newArray;
  };

  const handleOpenAddNodeModal = () => {
    if (selectedNode && selectedNode.isClicked) {
      setIsModalActive(true);
      setAddNodeTypes(selectedNode);
    }
  };

  const handleDeleteNodeModal = () => {
    let tab = [...tableOfContents];
    let tabTampon = [];
    tabTampon.push(selectedNode);
    setSelectedNode(null);
    for (let i = 0; i < tabTampon.length; i++) {
      for (let j = 0; j < tab.length; j++) {
        if (
          tab[j].parent === tabTampon[i].nodeLevel &&
          !tabTampon.includes(tab[j])
        ) {
          tabTampon.push(tab[j]);
        }
      }
    }
    for (let i = 0; i < tabTampon.length; i++) {
      for (let j = 0; j < tab.length; j++) {
        if (tab[j].nodeLevel === tabTampon[i].nodeLevel) {
          tab.splice(j, 1);
        }
      }
    }

    setTableOfcontents(tab);
  };

  const handleOpenAddTitleModal = (nodeInfo) => {
    setAddNodeInfo(nodeInfo);
    setIsNodeTitleActive(true);
  };
  const handleExitModal = () => {
    setSelectedNode(null);
    setIsModalActive(false);
    setIsNodeTitleActive(false);
    setAddNodeOptions([]);
    setAddNodeInfo(null);
    setAddNodeTitle("");
    let tempTOC = [...tableOfContents];
    setTableOfcontents([]);
    setTableOfContentsComponents([]);
    setTableOfcontents(tempTOC);
  };

  function generateHTMLFromGraph(graph) {
    let htmlString = "";

    function generateNodeHTML(node) {
      let nodeHTML = "";

      switch (node.nodeType) {
        case "DOC":
          nodeHTML += `<div class="node" data-node-type="DOC">
                <h1 class="node-doc">${node.nodeTitle}</h1>`;
          break;
        case "PART":
          nodeHTML += `<div class="node" data-node-type="PART">
                <h2 class="node-part">${node.nodeTitle}</h2>`;
          break;
        case "CHAPTER":
          nodeHTML += `<div class="node" data-node-type="CHAPTER">
                <h3 class="node-chapter">${node.nodeTitle}</h3>`;
          break;
        case "PARAGRAPH":
          nodeHTML += `<div class="node" data-node-type="PARAGRAPH">
                <h4 class="node-paragraph">${node.nodeTitle}</h4>`;
          break;
        case "NOTION":
          nodeHTML += `<div class="node" data-node-type="NOTION">
                <h5 class="node-notion">${node.nodeTitle}</h5>
                <p class="notion-body">${node.htmlContent}</p>`;
          break;
        default:
          break;
      }

      const children = graph.filter((n) => n.parent === node.nodeLevel);
      if (children.length > 0) {
        nodeHTML += '<div class="node-children">';
        children.forEach((child) => {
          nodeHTML += generateNodeHTML(child);
        });
        nodeHTML += "</div>";
      }

      nodeHTML += "</div>";

      return nodeHTML;
    }

    if (graph && graph.length > 0) {
      const root = graph.find((n) => n.parent === undefined);
      if (root) {
        htmlString = generateNodeHTML(root);
      }
    }

    return htmlString;
  }
  const sortTOC = (newTable) => {
    const newTOC = [...newTable];
    const emptyTOC = [];
    //search for the three root: {DOC}
    for (let i = 0, c = newTOC.length; i < c; i++) {
      if (newTOC[i].parent === undefined) {
        emptyTOC.push(newTOC[i]);
        i = newTOC.length;
      }
    }
    //console.log(emptyTOC)
    const filtered = findChildIndexArrayInTOC(newTOC[0], newTable);
    // console.log(filtered);
    //search for the direct children of each node
    for (let i = 0, c = newTOC.length; i < c; i++) {
      const children = findChildIndexArrayInTOC(newTOC[i].nodeLevel, newTable);
      const subTab = [];
      for (let j = 0, d = children.length; j < d; j++) {
        if (!emptyTOC.includes(children[j])) {
          subTab.push(children[j]);
        }
      }
      const indexOfNode = emptyTOC.indexOf(newTOC[i]);
      emptyTOC.splice(indexOfNode + 1, 0, ...subTab);
      // console.log(emptyTOC);
    }
    console.log(emptyTOC);
    return emptyTOC;
  };
  const InsertionSort = (tab) => {
    //nombre des éléments dans le tableau
    var len = tab.length;
    var tmp, i, j;

    for (i = 1; i < len; i++) {
      //stocker la valeur actuelle
      tmp = tab[i];
      j = i - 1;
      while (
        j >= 0 &&
        Number.parseInt(tab[j].nodeLevel[tab[j].nodeLevel.length - 1]) >
          Number.parseInt(tmp.nodeLevel[tmp.nodeLevel.length - 1])
      ) {
        // déplacer le nombre
        tab[j + 1] = tab[j];
        j--;
      }
      //Insère la valeur temporaire à la position
      //correcte dans la partie triée.
      tab[j + 1] = tmp;
    }
    return tab;
  };
  const findChildIndexArrayInTOC = (parentNodeLevel, newTable) => {
    let tempTOC = [...newTable];
    let newChildren = [];
    for (let i = 0, c = tempTOC.length; i < c; i++) {
      if (
        tempTOC[i].parent !== undefined &&
        tempTOC[i].parent === parentNodeLevel
      ) {
        newChildren.push(tempTOC[i]);
      }
    }
    newChildren = InsertionSort(newChildren);
    // console.log(newChildren);
    return newChildren;
  };
  const handleAddNewNodeToTOC = (nodeTitle) => {
    setAddNodeTitle(nodeTitle);
    /* Add to TOC Logic Here */
    let tempTOC = [...tableOfContents];
    setTableOfcontents([]);
    setTableOfContentsComponents([]);
    tempTOC[selectedNode.index].isClicked = false;
    const newNode = {
      nodeType: addNodeInfo.nodeType,
      nodeTitle: nodeTitle,
      nodeLevel:
        selectedNode.nodeType !== "NOTION"
          ? `${addNodeInfo.nodeInitial}${tempTOC.length}`
          : `${selectedNode.nodeLevel}${tempTOC.length}`,
      parent: `${selectedNode.nodeLevel}`,
      htmlContent: "",
      isClicked: false,
      isEnterPressed: false,
    };
    const newTOC = insertElementAtPosition(
      tempTOC,
      newNode,
      selectedNode.index + 1
    );
    const sortedTOC = sortTOC(newTOC);
    SORTEDTOC = sortedTOC;
    addElementToDoc(currentFileName, sortedTOC).then((data) => {});
    setTableOfcontents(sortedTOC);
    /* before the code bellow */
    setSelectedNode(null);
    setIsModalActive(false);
    setIsNodeTitleActive(false);
    setAddNodeOptions([]);
    setAddNodeInfo(null);
    setAddNodeTitle("");
  };

  const buildLeftCorner = (newTable) => {
    const leftCornerContent = [];
    for (let index = 0, c = newTable.length; index < c; index++) {
      leftCornerContent.push(
        <NodesCard
          key={index}
          index={index}
          nodeObject={newTable[index]}
          updateNode={updateEditedNodeTitle}
          setSelectedNode={setSelectedNodeInTOC}
          setEnterPressedNotion={setEnterPressNotionInTOC}
        />
      );
    }
    setTableOfContentsComponents(leftCornerContent);
  };

  const generateWordDocument = async () => {
    const response = await axios.post("/api/generate/word", {
      tableOfContents,
    });
    const { data } = response;
    // console.log(data);
  };

  useEffect(() => {
    if (newHTMLContent !== htmlEditorContent) {
      setNewHTMLContent(htmlEditorContent);
      //targetHTMLParseRef.current.innerHTML = ''
      const parsedHTML = parseStringToHTML(`${htmlEditorContent}`);
      //targetHTMLParseRef.current.appendChild(parsedHTML);
    }
  }, [newHTMLContent, htmlEditorContent]);

  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [currentFileName, setcurrentFileName] = useState("");
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  useEffect(() => {
    const renderingHtml = generateHTMLFromGraph(tableOfContents);
    setRenderingHtml(renderingHtml);
    buildLeftCorner(tableOfContents);
    selectedNode ? setContent(selectedNode.htmlContent) : setContent("");
    tableOfContents[1]
      ? localStorage.setItem("currentFile", JSON.stringify(tableOfContents))
      : "";
  }, [tableOfContents]);

  useEffect(() => {
    currentFileName === undefined || currentFileName === ""
      ? ""
      : localStorage.setItem("currentFileName", currentFileName);
  }, [currentFileName]);

  useEffect(() => {
    let currentTableOfContents = JSON.parse(
      localStorage.getItem("currentFile")
    );
    let currentFileName = localStorage.getItem("currentFileName");
    currentTableOfContents ? setTableOfcontents(currentTableOfContents) : "";
    currentFileName ? setcurrentFileName(currentFileName) : "";
  }, []);

  const quillModules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "align",
    "color",
    "code-block",
  ];

  const handleEditorChange = (newContent) => {
    selectedNode ? (selectedNode.htmlContent = newContent) : "";
    let tab = [...tableOfContents];
    selectedNode ? (tab[selectedNode.index].htmlContent = newContent) : "";
    setTableOfcontents(tab);
    setContent(newContent);
  };

  const handleCreateDocx = () => {
    let docx = "";
    let i;
    for (i = 0; i < tableOfContents.length; i++) {
      if (tableOfContents[i].htmlContent !== undefined) {
        docx = docx + `<p>${tableOfContents[i].nodeTitle}</p>`;
        docx = docx + tableOfContents[i].htmlContent;
      }
    }
    CreateDocx(docx, `./public/docxFile/${currentFileName}.docx`);

    setTimeout(() => {
      const downloadUrl = `/docxFile/${currentFileName}.docx`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${currentFileName}.docx`;
      link.click();
    }, 1000);
  };

  const handleCreatePdf = () => {
    let pdf = "";
    let i;
    for (i = 0; i < tableOfContents.length; i++) {
      if (tableOfContents[i].htmlContent !== undefined) {
        pdf = pdf + `<p>${tableOfContents[i].nodeTitle}</p>`;
        pdf = pdf + tableOfContents[i].htmlContent;
        console.log(tableOfContents);
      }
    }
    CreatePdf(pdf, `./public/pdfFile/${currentFileName}.pdf`);

    setTimeout(() => {
      const downloadUrl = `/pdfFile/${currentFileName}.pdf`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${currentFileName}.pdf`;
      link.click();
    }, 1000);
  };

  const handleOpenPdf = () => {
    let pdf = "";
    let i;
    for (i = 0; i < tableOfContents.length; i++) {
      if (tableOfContents[i].htmlContent !== undefined) {
        pdf = pdf + `<p>${tableOfContents[i].nodeTitle}</p>`;
        pdf = pdf + tableOfContents[i].htmlContent;
        console.log(tableOfContents);
      }
    }
    CreatePdf(pdf, `./public/pdfFile/${currentFileName}.pdf`);
    setTimeout(() => {
      window.open(`./pdfFile/${currentFileName}.pdf`);
    }, 1000);
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const handleCurrrentFileNameChange = (event) => {
    let tab = [...FilesList];
    let saveValue = event.target.value;
    tab[currentFileIndex] = saveValue;
    setcurrentFileName(saveValue);
    setFilesList(tab);
  };

  const [open, setOpen] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const [FilesList, setFilesList] = useState([]);

  const addFileToList = () => {
    let tab = [...FilesList];
    tab.push(fileName);
    console.log(tab);
    openDrawer();
    setcurrentFileName(fileName);
    setFileName(null);
    setFilesList(tab);
  };

  const changeCurrentFileIndex = (index) => {
    setCurrentFileIndex(index);
  };

  const handleSave = (fileName, sortedTOC) => {
    console.log(fileName);
    console.log(sortedTOC);

    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch("/api/Doc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emptyTOC: sortedTOC,
            email: "fogangzacharietene@gmail.com",
          }),
        });

        resolve(true);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  return (
    <div className="overflow-hidden w-full h-screen flex flex-col justify-between items-start">
      <Header />
      <Menu className="ml-5 pl-5 mt-2">
        <MenuHandler className="ml-5 pl-5 mt-2">
          <Button>Menu</Button>
        </MenuHandler>
        <MenuList className="z-10">
          <Popover className="z-50" placement="right">
            <PopoverHandler>
              <MenuItem> new file</MenuItem>
            </PopoverHandler>
            <PopoverContent className="w-96 ml-20">
              <Typography variant="h6" color="blue-gray" className="mb-6">
                New file creation
              </Typography>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-1 font-bold"
              >
                file name
              </Typography>
              <div className="flex gap-2">
                <Input
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  size="lg"
                  placeholder="exemple"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
                <Button
                  variant="gradient"
                  className="flex-shrink-0"
                  onClick={addFileToList || openDrawer}
                >
                  OK
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <MenuItem onClick={() => openDrawer()}>Open Project</MenuItem>
          <MenuItem onClick={() => handleSave(currentFileName, SORTEDTOC)}>
            save
          </MenuItem>
          <MenuItem onClick={() => handleOpenPdf()}>aperçu</MenuItem>
          <MenuItem onClick={() => handleCreateDocx()}>create docx</MenuItem>
          <MenuItem onClick={() => handleCreatePdf()}>create pdf</MenuItem>
        </MenuList>
      </Menu>
      {/* 
      <div>
        <div></div>

        <div></div>

        <div></div>
      </div> */}

      <div className="w-full h-full px-4 pt-4 flex justify-between items-start overflow-hidden">
        {/* the left corner mode */}
        <section className="w-[20%] h-full flex gap-2 flex-col justify-between  border-2 rounded-lg overflow-auto p-2 relative">
          <div className="w-full h-full">
            <h1
              style={{
                color: "black",
                backgroundColor: "#E2EBF9",
                padding: "8px 4px",
                borderRadius: 8,
                fontWeight: "bold",
              }}
            >
              Table of contents
            </h1>
            <div className="!text-left py-[4px] w-ful flex flex-col gap-[4px] pb-5">
              {tableOfContentsComponents}
            </div>
          </div>
          {selectedNode && selectedNode.isClicked ? (
            <div className="flex justify-center gap-4 ml-12 h-12 w-12 bottom-0 right-1">
              <span className="h-12 w-12 rounded-full bottom-0 right-1">
                <button
                  onClick={() => handleDeleteNodeModal()}
                  className="bg-red-600 w-12 h-12 rounded-full flex justify-center items-center"
                  style={{ borderRadius: 100, color: "white" }}
                >
                  <AiOutlineCloseCircle size={50} />
                </button>
              </span>
              <span className="h-12 w-12 rounded-full bottom-0 right-1">
                <button
                  onClick={() => handleOpenAddNodeModal()}
                  className="w-12 h-12 rounded-full flex justify-center items-center"
                  style={{
                    backgroundColor: "#4285F4",
                    borderRadius: 100,
                    color: "white",
                  }}
                >
                  <AiOutlinePlus size={20} />
                </button>
              </span>
            </div>
          ) : null}
          {isModalActive ? (
            <div className="modal-background inset-0 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80">
              {!isNodeTitleModalActive ? (
                <div className="modal-container">
                  {/* New Node Select Modal */}
                  <div className="flex justify-between px-2">
                    <span className="w-full text-center text-[24px] font-bold">
                      Add a Node to the Selected Node : {selectedNode.nodeTitle}
                    </span>
                    <button
                      onClick={() => handleExitModal()}
                      className="text-[24px] font-bold"
                      type="button"
                    >
                      X
                    </button>
                  </div>
                  <div className="border-2 border-[#4285F4] rounded-lg h-full flex flex-col justify-evenly items-center">
                    <span className="capitalize text-[20px] font-bold">
                      Select the node you want to add?
                    </span>
                    <div className="flex flex-row justify-evenly w-full">
                      {addNodeOptions.map((nodeOption, index) => (
                        <button
                          onClick={() => handleOpenAddTitleModal(nodeOption)}
                          key={index}
                          className="p-[8px] flex flex-col gap-[5px] items-center"
                          style={{
                            backgroundColor: "white",
                            borderRadius: 8,
                            boxShadow:
                              "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          <span
                            className="text-[50px]"
                            style={{
                              width: 100,
                              height: 100,
                              fontWeight: "bold",
                              padding: "8px",
                              borderRadius: 100,
                              textAlign: "center",
                              backgroundColor: `${nodeOption.nodeColor}`,
                              color: `${nodeOption.textColor}`,
                            }}
                          >
                            {nodeOption.nodeInitial}
                          </span>
                          <span style={{ color: "black", fontWeight: "bold" }}>
                            {nodeOption.nodeType}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="modal-container">
                  {/* New Node Title Input Modal */}
                  <div className="flex justify-between px-2">
                    <span className="w-full text-center text-[24px] font-bold">
                      Add a Node to the Selected Node : {selectedNode.nodeTitle}
                    </span>
                    <button
                      onClick={() => handleExitModal()}
                      className="text-[24px] font-bold"
                      type="button"
                    >
                      X
                    </button>
                  </div>
                  <div className="border-2 border-[#4285F4] rounded-lg h-full flex flex-col justify-evenly items-center">
                    <span className="capitalize text-[20px] font-bold">
                      Add a Title to the Node
                    </span>
                    <div className="flex flex-col justify-center items-center gap-1 w-full">
                      <div className="group">
                        <input
                          required=""
                          type="text"
                          className="input"
                          onChange={(e) => setAddNodeTitle(e.target.value)}
                          autoFocus
                        />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label>New Node Title</label>
                      </div>
                      <div
                        className="p-[6px] flex flex-row gap-[5px] items-baseline rounded-lg"
                        style={{
                          backgroundColor: "white",
                          boxShadow:
                            "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            padding: "2px 5px",
                            borderRadius: 100,
                            textAlign: "center",
                            backgroundColor: `${addNodeInfo.nodeColor}`,
                            color: `${addNodeInfo.textColor}`,
                          }}
                        >
                          {addNodeInfo.nodeInitial}
                        </span>
                        <span style={{ color: "black" }}>{addNodeTitle}</span>
                      </div>
                      <button
                        onClick={() => handleAddNewNodeToTOC(addNodeTitle)}
                        className="capitalize h-12 w-32 text-xl"
                        style={{
                          backgroundColor: "#4285F4",
                          borderRadius: 8,
                          color: "white",
                        }}
                      >
                        Add Node
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </section>

        {/* The Middle Section */}
        <section className="w-[60%] h-full flex flex-col justify-between items-start px-4 pb-1 overflow-hidden">
          <div className="h-16 w-full flex justiy-between items-center">
            <div className="w-full h-12">
              <h1 className="font-bold text-3xl uppercase">
                EDITION DE CONTENUS
              </h1>
            </div>
          </div>
          <div className="w-full relative h-[calc(100%-64px)] overflow-hidden border-[#E2EBF9] px-[2px] border-2 rounded-lg">
            {isNotionEditorActive && (
              <div className="w-full px-4 flex justify-end items-center h-[50px] z-50 border relative">
                <buttton
                  onClick={handlecloseEditor}
                  className="h-8 w-8 absolute right-8 top-14 z-50 flex justify-center items-center border cursor-pointer"
                >
                  <AiOutlineSave size={20} />
                </buttton>
              </div>
            )}
            <div className="w-full h-full overflow-scroll">
              {/* <div>{JSON.stringify({tableOfContents})}</div>
                        <br />
                        <br />
                        <div>{JSON.stringify(enterPressedNotion)}</div> */}
              {isNotionEditorActive && (
                <RichTextEditor
                  setHtmlContent={setHtmlEditorContent}
                  setJsonContent={setJsonEditorContent}
                  // defaultText=''
                  defaultHTMLString={defaultDraftHTML}
                />
              )}
              <div className="w-full h-full overflow-hidden bg-white p-4">
                {/* {isNotionEditorActive &&
                            <div className='html-viewer' >
                                <span style={{fontWeight:'bold'}}>Editor HTML content:</span>
                                <span>{`${DOMPurify.sanitize(renderingHtml)}`}</span>
                            </div>
                            } */}
                {/* {isNotionEditorActive &&
                            <div className='html-viewer' >
                                <span style={{fontWeight:'bold'}}>Editor Default HTML content:</span>
                                <span>{`${DOMPurify.sanitize(defaultDraftHTML)}`}</span>
                            </div>
                            } */}
                <main className="h-full">
                  <div className="flex flex-auto justify-between gap-x-2 mr-10">
                    <div className="rounded-lg">
                      <Input
                        type="text"
                        label="current file"
                        value={currentFileName}
                        onChange={handleCurrrentFileNameChange}
                      />
                    </div>
                    <Button onClick={() => setShowModal(true)}>chat</Button>
                  </div>
                  <div className="flex flex-auto justify-center h-full mx-2">
                    <QuillEditor
                      value={content}
                      onChange={handleEditorChange}
                      modules={quillModules}
                      formats={quillFormats}
                      className="w-full h-full mt-5 bg-white"
                    />
                  </div>
                </main>
              </div>
            </div>
          </div>
        </section>
        {/* notion finder zone */}
        <div className="w-[20%] h-full">
          <NotionFinder />
        </div>
        <div>
          <Drawer open={open} onClose={closeDrawer} className="p-4">
            <div className="h-full flex flex-col items-start border-2 rounded-lg overflow-auto">
              <Typography
                className="mt-4 ml-8 mb-8 pb-4 border-b-2"
                variant="h2"
              >
                Projects List
              </Typography>
              <div className="h-full flex flex-col items-start">
                <Card className="w-50">
                  <List>
                    {FilesList.map((item, index) => (
                      <ListItem
                        key={index}
                        ripple={false}
                        className="py-1 pr-1 pl-4"
                      >
                        <div onClick={() => console.log(FilesList[index])}>
                          {item}
                        </div>
                        <ListItemSuffix>
                          <IconButton variant="text" color="blue-gray">
                            <TrashIcon />
                          </IconButton>
                        </ListItemSuffix>
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </div>
            </div>
          </Drawer>
        </div>
      </div>

      {showModal ? (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={() => setShowModal(false)}
            ></div>
            <div className="flex items-center min-h-screen px-4 py-8">
              <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                <Chat />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default CreationEditor;
