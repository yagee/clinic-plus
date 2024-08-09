import { header } from "../components/header/header.js"
header();

import { dropdown } from "../components/dropdown/dropdown.js"
dropdown();

import { useDynamicAdapt } from "./libraries/dynamicAdapt/dynamicAdapt.js";
useDynamicAdapt();

tippy("[data-tippy-content]");