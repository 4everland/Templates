import home from "./home";
import files from "./files";

export default [
  {
    path: "/",
    component: home,
  },
  {
    path: "/list/:plat/:bucket",
    component: files,
  },
];
