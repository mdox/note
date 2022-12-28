import type { EditorThemeClasses } from "lexical";

import EditorThemeStyles from "./EditorThemeStyles.module.css";

export { EditorThemeStyles };

export const EditorTheme: EditorThemeClasses = {
  ltr: "ET__ltr",
  rtl: "ET__rtl",
  paragraph: "ET__paragraph",
  heading: {
    h1: "ET__h1",
    h2: "ET__h2",
    h3: "ET__h3",
    h4: "ET__h4",
    h5: "ET__h5",
    h6: "ET__h6",
  },
  link: "ET__link",
  list: {
    listitem: "ET__listItem",
    listitemChecked: "ET__listItemChecked",
    listitemUnchecked: "ET__listItemUnchecked",
    nested: {
      listitem: "ET__nestedListItem",
    },
    olDepth: ["ET__ol1", "ET__ol2", "ET__ol3", "ET__ol4", "ET__ol5"],
    ulDepth: ["ET__ul1", "ET__ul2", "ET__ul3", "ET__ul4", "ET__ul5"],
    ul: "ET__ul",
  },
  quote: "ET__quote",
  code: "ET__code",
  text: {
    bold: "ET__textBold",
    code: "ET__textCode",
    italic: "ET__textItalic",
    strikethrough: "ET__textStrikethrough",
    subscript: "ET__textSubscript",
    superscript: "ET__textSuperscript",
    underline: "ET__textUnderline",
    underlineStrikethrough: "ET__textUnderlineStrikethrough",
  },
};
