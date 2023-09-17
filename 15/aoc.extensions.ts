// import { Rectangle as CommonRectangle } from "../common/base/shapes";

// interface Rectangle extends CommonRectangle {
//     splitTopLevel(outerChars: string, delimiter: string): string[];
// }

// Rectangle.prototype.splitTopLevel = function (outerChars, delimiter) {
//     const outerBeg = outerChars[0];
//     const outerEnd = outerChars[1];

//     if (this.charAt(0) !== outerBeg || this.charAt(this.length - 1) !== outerEnd) {
//         throw new Error(`Invalid: Must be surrounded by ${outerChars}`);
//     }

//     const inner = this.slice(1, -1);

//     let depth = 0;
//     const outArray = [];
//     let partial = '';

//     inner.split('').forEach(element => {

//         if (element === outerBeg) {
//             depth++;
//         }
//         else if (element === outerEnd) {
//             depth--;
//         }

//         if (depth === 0 && element === delimiter) {
//             outArray.push(partial);
//             partial = '';
//         } else {
//             partial += element;
//         }
//     });

//     outArray.push(partial);

//     return outArray;
// }