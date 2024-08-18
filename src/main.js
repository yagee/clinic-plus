import { header } from "../components/header/header.js"
header();

import { reports } from "../blocks/reports/reports.js"
reports();

import { services } from "../blocks/services/services.js"
services();

import { feedback } from "../blocks/feedback/feedback.js"
feedback();

import { useDynamicAdapt } from "./libraries/dynamicAdapt/dynamicAdapt.js";
useDynamicAdapt();

tippy("[data-tippy-content]");

document.addEventListener("DOMContentLoaded", function() {
  const domain = window.location.origin;

  const processSrc = element => {
      let src = element.getAttribute("src")?.trim();

      if (!src) return;

      try {
          const url = new URL(src);
          return;
      } catch (e) {}

      if (!src.startsWith('/')) {
          src = `/${src}`;
      }

      src = `${domain}${src}`;

      element.setAttribute("src", src);
  }

  const processBackgroundImage = element => {
      let backgroundImage = getComputedStyle(element).backgroundImage;

      if (!backgroundImage || backgroundImage === 'none') return;

      const urlMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);

      if (urlMatch && urlMatch[1]) {
          let url = urlMatch[1].trim();

          try {
              const parsedUrl = new URL(url);
              return;
          } catch (e) {}

          if (!url.startsWith('/')) {
              url = `/${url}`;
          }

          url = `${domain}${url}`;

          element.style.backgroundImage = `url(${url})`;
      }
  }

  const processCssRules = rules => {
      for (let rule of rules) {
          if (rule.style && (rule.style.backgroundImage || rule.style.content)) {
              let backgroundImage = rule.style.backgroundImage;
              let content = rule.style.content;

              if (backgroundImage && backgroundImage.includes('url(')) {
                  let urlMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                  if (urlMatch && urlMatch[1]) {
                      let url = urlMatch[1].trim();

                      try {
                          const parsedUrl = new URL(url);
                      } catch (e) {
                          if (!url.startsWith('/')) {
                              url = `/${url}`;
                          }

                          url = `${domain}${url}`;

                          rule.style.backgroundImage = `url(${url})`;
                      }
                  }
              }

              if (content && content.includes('url(')) {
                  let urlMatch = content.match(/url\(["']?(.*?)["']?\)/);
                  if (urlMatch && urlMatch[1]) {
                      let url = urlMatch[1].trim();

                      try {
                          const parsedUrl = new URL(url);
                      } catch (e) {
                          if (!url.startsWith('/')) {
                              url = `/${url}`;
                          }

                          url = `${domain}${url}`;

                          rule.style.content = `url(${url})`;
                      }
                  }
              }
          }
      }
  }

  const processStylesheets = () => {
      for (let sheet of document.styleSheets) {
          try {
              if (sheet.cssRules) {
                  processCssRules(sheet.cssRules);
              }
          } catch (e) {
              console.warn("Не удалось получить доступ к правилам стилей для одного из файлов CSS.");
          }
      }
  }

  const processElements = elements => {
      elements.forEach(element => {
          if (element.nodeType === Node.ELEMENT_NODE) {
              if (element.hasAttribute("src")) {
                  processSrc(element);
              }
              processBackgroundImage(element);
          }
      });
  }

  const elements = document.querySelectorAll("[src], [style*='background-image']");
  processElements(elements);
  processStylesheets();

  const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
          if (mutation.type === "childList") {
              const addedElements = Array.from(mutation.addedNodes).filter(node => node.nodeType === Node.ELEMENT_NODE);
              processElements(addedElements);
          } else if (mutation.type === "attributes") {
              if (mutation.target.nodeType === Node.ELEMENT_NODE) {
                  if (mutation.attributeName === "style") {
                      processBackgroundImage(mutation.target);
                  } else if (mutation.attributeName === "src") {
                      processSrc(mutation.target);
                  }
              }
          }
      });
  });

  observer.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true
  });
});