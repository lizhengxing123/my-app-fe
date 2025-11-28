export default function MdAnchor({ anchorHtml }: { anchorHtml: string }) {
  return (
    <div className="fixed top-24 right-4" dangerouslySetInnerHTML={{ __html: anchorHtml }}></div>
  );
}