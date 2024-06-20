import { MentionModuleOptions } from "./Mention";
import Mention from "./Mention";
import MentionBlot from "./MentionBlot";

/**
 * @note Do not uppercase first key of blot or module
 */
export const CUSTOM_MODULES = {
    MENTION: 'mention',
    MENTION_BLOT: 'mentionBlot',
} as const;
type CustomModuleKey = typeof CUSTOM_MODULES[keyof typeof CUSTOM_MODULES];

const customModules = {
    Mention,
    MentionBlot
};

export type { MentionModuleOptions, CustomModuleKey };
export default customModules;