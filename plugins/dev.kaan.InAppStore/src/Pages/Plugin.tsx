import React, { useState, useEffect } from "react";
import { Classes, ComponentsPack, HeaderTypes } from "../util";
import { Flex } from "replugged/components";
import { toast } from "replugged/common";
function JustWorkPlease() {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    // Fetch the plugins data when the component is mounted
    fetch("https://replugged.dev/api/store/list/plugin?page=1&items=12&query")
      .then((response) => response.json())
      .then((data) => {
        const pluginArr = Object.keys(data.results).map((key) => {
          const plugin = data.results[key];
          return {
            id: plugin.id,
            name: plugin.name,
            source: plugin.source,
            author: plugin.author.name,
            version: plugin.version,
          };
        });
        setPlugins(pluginArr);
      });
  }, []);

  return (
    <div className={Classes.title}>
      <ComponentsPack.Text
        className={"replugged-updater-items"}
        style={{ color: "white", fontSize: "1.3rem" }}>
        Plugin Store
      </ComponentsPack.Text>
      {plugins.map((plugin) => (
        <div
          className={"replugged-updater-items"}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <ComponentsPack.Text style={{ align: "left", fontSize: "1.2rem", color: "white" }}>
              {plugin.name}
            </ComponentsPack.Text>
            <ComponentsPack.Text style={{ align: "left", fontSize: "1.0rem", color: "white" }}>
              {plugin.author}
            </ComponentsPack.Text>
            <ComponentsPack.Text style={{ align: "left", fontSize: "1.2rem", color: "white" }}>
              {plugin.version}
            </ComponentsPack.Text>
          </div>

          <ComponentsPack.Button
            style={{ fontSize: "1rem", textAlign: "center" }}
            onClick={() => {
              const FullPathID = `${plugin.id}.asar`;
              RepluggedNative.installer.install(
                "replugged-plugin",
                FullPathID,
                `https://replugged.dev/api/v1/store/${plugin.id}.asar`,
                plugin.version,
              );
              toast.toast(`${plugin.name} installed!`, toast.Kind.SUCCESS);
            }}>
            Install
          </ComponentsPack.Button>
        </div>
      ))}
    </div>
  );
}

export default JustWorkPlease;
