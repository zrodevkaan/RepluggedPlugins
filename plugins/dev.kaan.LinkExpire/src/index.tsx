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


const inject = new Injector();
const ModalList: any = webpack.getByProps("ConfirmModal"); // CAN YOU STOP NOW. THANKS <3
const { parse }: any = webpack.getByProps(["defaultRules", "parse"]);

function hexToDate(hexTimestamp) {
  const decimalTimestamp = parseInt(hexTimestamp, 16);
  return new Date(decimalTimestamp * 1000);
}

function extractParts(url) {
  const parts = url.split("=");
  return parts.slice(1, 3).map((part) => part.split("&")[0]);
}

export function start() {
  inject.utils.addMenuItem(
    "attachment-link-context" as ContextMenuTypes,
    (data) => (
      <>
        <MenuItem
          id="more-information"
          label="More Information"
          action={() => {
            OpenModal(data as any);
          }}
        />
      </>
    )
  );

  inject.utils.addMenuItem(
    ContextMenuTypes.Message,
    (data) => (
      <>
        <MenuItem
          id="more-information"
          label="More Information"
          action={() => {
            OpenModal(data as any);
          }}
        />
      </>
    )
  );
}

function extractFilenameFromUrl(url) {
  const splitUrl = url.split("/");
  return splitUrl[splitUrl.length - 1].split("?")[0];
}

function OpenModal(data: { attachmentName: string; attachmentUrl: string; itemSafeSrc: string, itemHref: string }) {
  console.log(data)
  const URL = data.attachmentUrl ?? data.itemSafeSrc ?? data.itemHref;
  const DeconstructedURL = extractParts(URL);
  const Expiring = hexToDate(DeconstructedURL[0]).getTime() / 1000;
  const Sent = hexToDate(DeconstructedURL[1]).getTime() / 1000;
  const ExpiringFormat = parse(`<t:${Expiring}>`)[0];
  const SentFormat = parse(`<t:${Sent}>`)[0];
  modal.openModal((props) => (
    <ModalList.ConfirmModal
      {...props}
      header={`${data.attachmentName ?? extractFilenameFromUrl(URL)}`}
      confirmText="Confirm"
      cancelText="Cancel"
      onConfirm={() => { }}
      style={{ width: `1213px`, maxHeight: 'none', maxWidth: 'none' }}
    >
      <ModalList.Text style={{ padding: '10px 0' }}>
        <span style={{ fontWeight: 'bold' }}>Expiring:</span> {ExpiringFormat}
      </ModalList.Text>
      <ModalList.Text style={{ padding: '10px 0' }}>
        <span style={{ fontWeight: 'bold' }}>Sent:</span> {SentFormat}
      </ModalList.Text>
      <ModalList.Text style={{ padding: '10px 0', fontWeight: 'bold' }}> Image: </ModalList.Text>
      <img src={data.attachmentUrl ?? URL} />
    </ModalList.ConfirmModal>
  ));
}

export function stop() {
  inject.uninjectAll();
}
