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