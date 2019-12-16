/* eslint-disable react/react-in-jsx-scope */
export function highlighter(text, searchWord, className = 'highlight') {
  text = text.toString();
  if (searchWord == null || searchWord === '') {
    return text;
  }

  const parts = text.split(new RegExp(`(${searchWord})`, 'gi')); //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
  return <span> {parts.map((part, i) =>
    <span key={i} className={part.toLowerCase() === searchWord.toLowerCase() ? className : null}>
      {part}
    </span>)
  } </span>;
}