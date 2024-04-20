import React, { useState, useEffect } from "react";
import { Classes, ComponentsPack, HeaderTypes, TypescriptCantFindRepluggedNative } from "../util";
import { Flex } from "replugged/components";
import { toast } from "replugged/common";
import { plugins } from "replugged";
function JustWorkPlease() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [loading, setLoading] = useState(false);
  const [pluginsA, setPlugins] = useState([]);
  const cooldown = 1000;
  const [numPages, setNumPages] = useState(0);
  const [installedPlugins, setInstalledPlugins] = useState({});
  const scroller = document.querySelector('[class*="contentRegionScroller"]');

  const scrollSmooth = () => {
    setTimeout(() => {
      scroller.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 500);
  };

  const nextPage = () => {
    if (currentPage < 30 && !loading) {
      setCurrentPage(currentPage + 1);
      scrollSmooth();
    }
  };

  const previousPage = () => {
    if (currentPage > 1 && !loading) {
      setCurrentPage(currentPage - 1);
      scrollSmooth();
    }
  };
  useEffect(() => {
    setLoading(true); // start cooldown
    fetch(
      `https://replugged.dev/api/store/list/plugin?page=${currentPage}&items=${itemsPerPage}&query`,
    )
      .then((response) => {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded");
        }
        return response.json();
      })
      .then((data) => {
        const pluginArr = Object.keys(data.results).map((key) => {
          const plugin = data.results[key];
          return {
            id: plugin.id,
            name: plugin.name,
            source: plugin.source,
            author: plugin.author.name,
            version: plugin.version,
            image: plugin.image,
            desc: plugin.description,
          };
        });
        const installedPlugins = {};
        pluginArr.forEach((plugin) => {
          installedPlugins[plugin.id] = plugins.plugins.get(plugin.id);
        });
        setInstalledPlugins(installedPlugins);
        setPlugins(pluginArr);
        setNumPages(data.numPages);
        setTimeout(() => setLoading(false), cooldown);
      })
      .catch((error) => {
        setPlugins([
          {
            id: 0,
            name: "Error 429",
            source: "#",
            author: "System",
            version: "6.6.6",
            desc: "We have ran into some issues. Come back later!",
          },
        ]);
      });
  }, [currentPage]);

  return (
    <div id='owo-grids'>
      <ComponentsPack.Text className="heading-lg-semibold_a200cd" style={{ color: "white" }}>
        Plugin Store
      </ComponentsPack.Text>
      <ComponentsPack.FormDivider className={"owo-divider"}></ComponentsPack.FormDivider>
      {pluginsA.map((plugin) => (
        <div
          className={"owo-card"}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <ComponentsPack.Text className="owo-bigtext" style={{ align: "left", color: "white" }}>
              {plugin.name}
              <ComponentsPack.Text
                className="owo-smalltext"
                style={{ align: "left", color: "white" }}>
                v{plugin.version}
              </ComponentsPack.Text>
            </ComponentsPack.Text>
            <ComponentsPack.Text
              className="owo-smalltext"
              style={{ align: "left", color: "white" }}>
              {plugin.author}
            </ComponentsPack.Text>
            <ComponentsPack.Text
              className="owo-smalltext"
              style={{ align: "left", color: "white" }}>
              {plugin.desc}
            </ComponentsPack.Text>
            <img
              style={{ maxWidth: 400, borderRadius: "10px" }}
              src={plugin.image}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://replugged.dev/assets/replugged-b625c392.png";
              }}
            />
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
            }}
            disabled={!!installedPlugins[plugin.id]}>
            {installedPlugins[plugin.id] ? "Installed" : "Install"}
          </ComponentsPack.Button>
        </div>
      ))}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "1rem",
        }}>
        <ComponentsPack.Button onClick={previousPage} disabled={currentPage === 1 || loading}>
          Previous
        </ComponentsPack.Button>
        <ComponentsPack.Text style={{ margin: "0 1rem", textAlign: "center", alignSelf: "center" }}>
          Page {currentPage}
        </ComponentsPack.Text>
        <ComponentsPack.Button onClick={nextPage} disabled={currentPage === numPages || loading}>
          Next
        </ComponentsPack.Button>
      </div>
    </div>
  );
}

export default JustWorkPlease;
