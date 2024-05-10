import { common, components, Injector, webpack } from "replugged";
import { ContextMenuTypes } from "replugged/types";

const {
  ContextMenu: { MenuItem },
} = components;
const {
  React,
  modal,
  toast: {
    Kind: { FAILURE, SUCCESS },
    toast,
  },
  users,
} = common;

interface WebpackProps {
  colorBrand: string;
}
interface UserData {
  username: string;
  id: string;
}

interface UserStore {
  getUser: (string: string) => {};
}
interface UserType {
  id: string;
}

const inject = new Injector();
const ModalList: any = webpack.getByProps("ConfirmModal");
const { TextArea }: any = webpack.getByProps("TextArea");
const { parse }: any = webpack.getByProps("defaultRules");

export function start() {
  inject.utils.addMenuItem(
    "textarea-context" as ContextMenuTypes,
    (data) => (
      <>
        <MenuItem
          id="color-text"
          label="Color Text"
          action={() => {
            OpenModal(data as any);
          }}
        />
      </>
    )
  );
}

const convertToRGB = (colorCode) => {
  // why did I agree to this.
  const hexColor = getColorCode(colorCode);
  const rgbColor = hexToRgb(hexColor);
  return `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 1)`;
};

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

const ANSI_COLORS = {
  30: "#4f545c",
  31: "#dc322f",
  32: "#859900",
  33: "#b58900",
  34: "#268bd2",
  35: "#d33682",
  36: "#2aa198",
  37: "#ffffff",
  40: "#002b36",
  41: "#cb4b16",
  42: "#586e75",
  43: "#657b83",
  44: "#839496",
  45: "#6c71c4",
  46: "#93a1a1",
  47: "#fdf6e3",
};

function OpenModal(data: any) {
  // State to store the content of the TextArea
  const WrapMeOwO = (props) => {
    const [textAreaContent, setTextAreaContent] = React.useState("");

    const textColors = Object.fromEntries(
      Object.entries(ANSI_COLORS).filter(([code]) => parseInt(code) < 40)
    );

    const backgroundColors = Object.fromEntries(
      Object.entries(ANSI_COLORS).filter(([code]) => parseInt(code) >= 40)
    );

    const renderColorGrid = (colors, background = false) => (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "5px",
          marginTop: "10px",
          background: "transparent",
          padding: background ? "10px" : "0",
        }}
      >
        {Object.keys(colors).map((colorCode) => (
          <button
            key={colorCode}
            onClick={() => handleColorButtonClick(colorCode, setTextAreaContent, textAreaContent)}
            style={{
              backgroundColor: background ? colors[colorCode] : "transparent",
              color: background ? "#000" : colors[colorCode],
              borderRadius: "10%",
              padding: "10px",
              margin: "5px", // Add margin between buttons
              cursor: "pointer",
            }}
          >
            {`Color ${colorCode}`}
          </button>
        ))}
      </div>
    );

    return (
      <ModalList.ConfirmModal
        {...props}
        header={`Convert Text to ANSI`}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={() => {}}
      >
        <TextArea
          placeholder="Input text"
          value={textAreaContent}
          onChange={(e) => setTextAreaContent(e)}
        ></TextArea>

        {renderColorGrid(textColors)}
        {renderColorGrid(backgroundColors, true)}
      </ModalList.ConfirmModal>
    );
  }
  modal.openModal((props) => <WrapMeOwO {...props} />);
}

function handleColorButtonClick(colorCode: string, setTextAreaContent: React.Dispatch<React.SetStateAction<string>>, textAreaContent: string) {
  let selectedText = window.getSelection().toString();
  console.log(colorCode)
  console.log(convertToRGB(colorCode))
  if (selectedText) {
    const coloredText = `\x1b[${colorCode}m${selectedText}\x1b[0m`;
    const replacedText = textAreaContent.replace(selectedText, coloredText)
    setTextAreaContent(replacedText);
  }
}

function getColorCode(code: string): string {
  return code.startsWith("3") ? `#${code}3333` : `#${code}`;
}

export function stop() {
  inject.uninjectAll();
}
