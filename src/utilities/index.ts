class MentionUtils {
  /**
   * @description this method attach dataset to the element by checking the dataAttributes
   */
  static attachDataset(
    element: HTMLElement,
    data: {
      [key: string]: string | undefined;
      id: string;
      value: string;
    },
    dataAttributes: string[]
  ) {
    const mention = element;
    Object.keys(data).forEach((key) => {
      if (dataAttributes.indexOf(key) > -1) {
        mention.dataset[key] = data[key];
      } else {
        delete mention.dataset[key];
      }
    });
    return mention;
  }

  static setInnerContent(element: HTMLElement, value: HTMLElement | string | null) {
    if (value === null) return;
    if (typeof value === 'object') element.appendChild(value);
    else element.innerText = value;
  }

  static getMentionCharIndex(
    text: string,
    denotationChars: string[],
    isolateChar: boolean,
    allowInlineMentionChar: boolean
  ): { mentionChar: string | null; mentionCharIndex: number } {
    return denotationChars.reduce(
      (prev, mentionChar) => {
        let mentionCharIndex;

        if (isolateChar && allowInlineMentionChar) {
          const regex = new RegExp(`^${mentionChar}|\\s${mentionChar}`, 'g');
          const lastMatch = (text.match(regex) || []).pop();

          if (!lastMatch) {
            return {
              mentionChar: prev.mentionChar,
              mentionCharIndex: prev.mentionCharIndex
            };
          }

          mentionCharIndex = lastMatch !== mentionChar ? text.lastIndexOf(lastMatch) + lastMatch.length - mentionChar.length : 0;
        } else {
          mentionCharIndex = text.lastIndexOf(mentionChar);
        }

        if (mentionCharIndex > prev.mentionCharIndex) {
          return {
            mentionChar,
            mentionCharIndex
          };
        }
        return {
          mentionChar: prev.mentionChar,
          mentionCharIndex: prev.mentionCharIndex
        };
      },
      { mentionChar: null as string | null, mentionCharIndex: -1 }
    );
  }

  static isValidChars(text: string, allowedChars: RegExp) {
    return allowedChars.test(text);
  }

  static isValidCharIndex(mentionCharIndex: number, text: string, isolateChar: boolean, textPrefix: string) {
    if (mentionCharIndex === -1) {
      return false;
    }

    if (!isolateChar) {
      return true;
    }

    const mentionPrefix = mentionCharIndex ? text[mentionCharIndex - 1] : textPrefix;

    return !mentionPrefix || !!mentionPrefix.match(/\s/);
  }
}

export { MentionUtils };