import Quill from 'quill';
import RootComponent from '@components/ReactForQuill';

export * from '@modules/index';
export * as Models from '@src/Models/index.model';

export * from '@src/Blots';
export * from '@src/Modules/Mention';

export * from '@src/constants';

type rootType = typeof RootComponent;
export type RFQComponent = rootType & { Quill: typeof Quill };
const ReactForQuill = {
    ...RootComponent,
    Quill
} as RFQComponent;
export default ReactForQuill;
