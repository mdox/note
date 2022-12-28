import { $createCodeNode } from "@lexical/code";
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { HeadingTagType } from "@lexical/rich-text";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import {
  $isParentElementRTL,
  $selectAll,
  $wrapNodes,
} from "@lexical/selection";
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import {
  mdiCodeTags,
  mdiFormatAlignCenter,
  mdiFormatAlignJustify,
  mdiFormatAlignLeft,
  mdiFormatAlignRight,
  mdiFormatBold,
  mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatHeader3,
  mdiFormatHeader4,
  mdiFormatHeader5,
  mdiFormatHeader6,
  mdiFormatIndentDecrease,
  mdiFormatIndentIncrease,
  mdiFormatItalic,
  mdiFormatLetterCase,
  mdiFormatListBulleted,
  mdiFormatListChecks,
  mdiFormatListNumbered,
  mdiFormatQuoteOpen,
  mdiFormatStrikethrough,
  mdiFormatSubscript,
  mdiFormatSuperscript,
  mdiFormatUnderline,
  mdiRedo,
  mdiText,
  mdiTrashCan,
  mdiUndo,
} from "@mdi/js";
import Icon from "@mdi/react";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  DEPRECATED_$isGridSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CommonKey } from "../../../types/i18next";
import Button from "../components/Button";
import Dropdown, { DropdownItem } from "../components/Dropdown";
import { i18n } from "../i18n";

type BlockType =
  | "paragraph"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "bullet"
  | "number"
  | "check"
  | "quote"
  | "code";

const blockTypeToText: { [P in BlockType]: string } = {
  paragraph: i18n["toolbar.block.paragraph"],
  h1: i18n["toolbar.block.h1"],
  h2: i18n["toolbar.block.h2"],
  h3: i18n["toolbar.block.h3"],
  h4: i18n["toolbar.block.h4"],
  h5: i18n["toolbar.block.h5"],
  h6: i18n["toolbar.block.h6"],
  bullet: i18n["toolbar.block.bullet"],
  number: i18n["toolbar.block.number"],
  check: i18n["toolbar.block.check"],
  quote: i18n["toolbar.block.quote"],
  code: i18n["toolbar.block.code"],
};

const blockTypeToIcon: { [P in BlockType]: string } = {
  paragraph: mdiText,
  h1: mdiFormatHeader1,
  h2: mdiFormatHeader2,
  h3: mdiFormatHeader3,
  h4: mdiFormatHeader4,
  h5: mdiFormatHeader5,
  h6: mdiFormatHeader6,
  bullet: mdiFormatListBulleted,
  number: mdiFormatListNumbered,
  check: mdiFormatListChecks,
  quote: mdiFormatQuoteOpen,
  code: mdiCodeTags,
};

export default function ToolbarPlugin() {
  const { t } = useTranslation();

  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  void isRTL;

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsCode(selection.hasFormat("code"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsRTL($isParentElementRTL(selection));

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();

          if (type in blockTypeToText) {
            setBlockType(type as BlockType);
          }
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToText) {
            setBlockType(type as BlockType);
          }
        }
      }
    }
  }, [activeEditor]);

  const undo = () => activeEditor.dispatchCommand(UNDO_COMMAND, undefined);

  const redo = () => activeEditor.dispatchCommand(REDO_COMMAND, undefined);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();

        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $wrapNodes(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if (blockType !== "check") {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCodeBlock = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();

        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          if (selection.isCollapsed()) {
            $wrapNodes(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  const formatBold = () =>
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");

  const formatItalic = () =>
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");

  const formatUnderline = () =>
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");

  const formatCode = () =>
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");

  const formatStrikethrough = () =>
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");

  const formatSubscript = () =>
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");

  const formatSuperscript = () =>
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");

  const clearFormatting = () => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $selectAll(selection);
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            node.setFormat(0);
            node.setStyle("");
            $getNearestBlockElementAncestorOrThrow(node).setFormat("");
          }
        });
      }
    });
  };

  const alignLeft = () =>
    activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");

  const alignCenter = () =>
    activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");

  const alignRight = () =>
    activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");

  const alignJustify = () =>
    activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");

  const indentDecrease = () =>
    activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);

  const indentIncrease = () =>
    activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);

  useEffect(() => {
    if (isEditable !== editor.isEditable()) {
      setIsEditable(editor.isEditable());
    }
  }, [editor, isEditable]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [activeEditor, editor, updateToolbar]);

  return (
    <div className="flex flex-nowrap divide-x divide-gray-600 overflow-x-auto overflow-y-hidden p-2 [&>div:not(:first-child)]:ml-2 [&>div:not(:first-child)]:pl-2 [&>div]:shrink-0">
      <div>
        <Button disabled={!canUndo || !isEditable} onClick={undo}>
          <Icon path={mdiUndo} size={0.75} />
        </Button>
        <Button disabled={!canRedo || !isEditable} onClick={redo}>
          <Icon path={mdiRedo} size={0.75} />
        </Button>
      </div>
      <div>
        <Dropdown
          icon={blockTypeToIcon[blockType]}
          text={t(blockTypeToText[blockType] as CommonKey)}
          disabled={!isEditable}
        >
          <div>
            <DropdownItem
              highlighted={blockType === "paragraph"}
              onClick={formatParagraph}
            >
              <Icon path={mdiText} size={0.75} />
              {t(i18n["toolbar.block.paragraph"] as CommonKey)}
            </DropdownItem>
          </div>
          <div>
            <DropdownItem
              highlighted={blockType === "h1"}
              onClick={() => formatHeading("h1")}
            >
              <Icon path={mdiFormatHeader1} size={0.75} />
              {t(i18n["toolbar.block.h1"] as CommonKey)}
            </DropdownItem>
            <DropdownItem
              highlighted={blockType === "h2"}
              onClick={() => formatHeading("h2")}
            >
              <Icon path={mdiFormatHeader2} size={0.75} />
              {t(i18n["toolbar.block.h2"] as CommonKey)}
            </DropdownItem>
            <DropdownItem
              highlighted={blockType === "h3"}
              onClick={() => formatHeading("h3")}
            >
              <Icon path={mdiFormatHeader3} size={0.75} />
              {t(i18n["toolbar.block.h3"] as CommonKey)}
            </DropdownItem>
          </div>
          <div>
            <DropdownItem
              highlighted={blockType === "bullet"}
              onClick={formatBulletList}
            >
              <Icon path={mdiFormatListBulleted} size={0.75} />
              {t(i18n["toolbar.block.bullet"] as CommonKey)}
            </DropdownItem>
            <DropdownItem
              highlighted={blockType === "number"}
              onClick={formatNumberedList}
            >
              <Icon path={mdiFormatListNumbered} size={0.75} />
              {t(i18n["toolbar.block.number"] as CommonKey)}
            </DropdownItem>
            <DropdownItem
              highlighted={blockType === "check"}
              onClick={formatCheckList}
            >
              <Icon path={mdiFormatListChecks} size={0.75} />
              {t(i18n["toolbar.block.check"] as CommonKey)}
            </DropdownItem>
          </div>
          <div>
            <DropdownItem
              highlighted={blockType === "quote"}
              onClick={formatQuote}
            >
              <Icon path={mdiFormatQuoteOpen} size={0.75} />
              {t(i18n["toolbar.block.quote"] as CommonKey)}
            </DropdownItem>
            <DropdownItem
              highlighted={blockType === "code"}
              onClick={formatCodeBlock}
            >
              <Icon path={mdiCodeTags} size={0.75} />
              {t(i18n["toolbar.block.code"] as CommonKey)}
            </DropdownItem>
          </div>
        </Dropdown>
      </div>
      <div>
        <Button dim={!isBold} disabled={!isEditable} onClick={formatBold}>
          <Icon path={mdiFormatBold} size={0.75} />
        </Button>
        <Button dim={!isItalic} disabled={!isEditable} onClick={formatItalic}>
          <Icon path={mdiFormatItalic} size={0.75} />
        </Button>
        <Button
          dim={!isUnderline}
          disabled={!isEditable}
          onClick={formatUnderline}
        >
          <Icon path={mdiFormatUnderline} size={0.75} />
        </Button>
        <Button dim={!isCode} disabled={!isEditable} onClick={formatCode}>
          <Icon path={mdiCodeTags} size={0.75} />
        </Button>
        <Dropdown icon={mdiFormatLetterCase} disabled={!isEditable}>
          <div>
            <DropdownItem
              highlighted={isStrikethrough}
              onClick={formatStrikethrough}
            >
              <Icon path={mdiFormatStrikethrough} size={0.75} />
              {t(i18n["toolbar.format.strikethrough"] as CommonKey)}
            </DropdownItem>
            <DropdownItem highlighted={isSubscript} onClick={formatSubscript}>
              <Icon path={mdiFormatSubscript} size={0.75} />
              {t(i18n["toolbar.format.subscript"] as CommonKey)}
            </DropdownItem>
            <DropdownItem
              highlighted={isSuperscript}
              onClick={formatSuperscript}
            >
              <Icon path={mdiFormatSuperscript} size={0.75} />
              {t(i18n["toolbar.format.superscript"] as CommonKey)}
            </DropdownItem>
          </div>
          <div>
            <DropdownItem onClick={clearFormatting}>
              <Icon path={mdiTrashCan} size={0.75} />
              {t(i18n["toolbar.format.clearFormatting"] as CommonKey)}
            </DropdownItem>
          </div>
        </Dropdown>
      </div>
      <div>
        <Dropdown
          icon={mdiFormatAlignLeft}
          text={t(i18n["toolbar.align.align"] as CommonKey)}
          disabled={!isEditable}
        >
          <div>
            <DropdownItem onClick={alignLeft}>
              <Icon path={mdiFormatAlignLeft} size={0.75} />
              <span>{t(i18n["toolbar.align.alignLeft"] as CommonKey)}</span>
            </DropdownItem>
            <DropdownItem onClick={alignCenter}>
              <Icon path={mdiFormatAlignCenter} size={0.75} />
              <span>{t(i18n["toolbar.align.alignCenter"] as CommonKey)}</span>
            </DropdownItem>
            <DropdownItem onClick={alignRight}>
              <Icon path={mdiFormatAlignRight} size={0.75} />
              <span>{t(i18n["toolbar.align.alignRight"] as CommonKey)}</span>
            </DropdownItem>
            <DropdownItem onClick={alignJustify}>
              <Icon path={mdiFormatAlignJustify} size={0.75} />
              <span>{t(i18n["toolbar.align.alignJustify"] as CommonKey)}</span>
            </DropdownItem>
          </div>
          <div>
            <DropdownItem onClick={indentDecrease}>
              <Icon path={mdiFormatIndentDecrease} size={0.75} />
              <span>{t(i18n["toolbar.align.outdent"] as CommonKey)}</span>
            </DropdownItem>
            <DropdownItem onClick={indentIncrease}>
              <Icon path={mdiFormatIndentIncrease} size={0.75} />
              <span>{t(i18n["toolbar.align.indent"] as CommonKey)}</span>
            </DropdownItem>
          </div>
        </Dropdown>
      </div>
    </div>
  );
}
