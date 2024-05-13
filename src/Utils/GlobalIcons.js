import { library } from "@fortawesome/fontawesome-svg-core";

import {
  faPenToSquare,
  faXmark,
  faTrash,
  faDownload,
  faUpload,
  faCheck,
  faCircleUser,
  faEllipsis,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

export const globalIcons = () =>
  library.add(
    faXmark,
    faPenToSquare,
    faTrash,
    faDownload,
    faUpload,
    faCheck,
    faCircleUser,
    faEllipsis,
    faEye
  );
