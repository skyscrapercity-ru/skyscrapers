import { defineComponent } from "./composition-root";
import { RatingBox } from "./components/rating-box";
import { TableRow } from "./components/table-row";

defineComponent('table-row', TableRow);
defineComponent('rating-box', RatingBox);