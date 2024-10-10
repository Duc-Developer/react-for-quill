import Quill from 'quill';
import RootComponent from '@components/ReactForQuill';
import MentionBlot, { MentionBlotData, isMentionBlot, MentionEvent } from '@src/Blots/MentionBlot';
import Mention, { MentionClasses, MentionOption } from '@src/Modules/Mention';

export * as Models from '@src/Models/index.model';
export * from '@src/constants';

type rootType = typeof RootComponent;
export type RFQComponent = rootType & { Quill: typeof Quill };
const ReactForQuill = {
    ...RootComponent,
    Quill
} as RFQComponent;
export {
    MentionBlot,
    MentionBlotData,
    isMentionBlot,
    MentionEvent,
    Mention,
    MentionClasses,
    MentionOption
};
export default ReactForQuill;
