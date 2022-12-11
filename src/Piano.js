import usePaino from "./usePaino";
import cx from "clsx";

export default function Piano({ notes, isVisible }) {
  const ref = usePaino({ notes });
  return (
    <div className={cx("piano-wrapper", { "is-visible": isVisible })}>
      <figure className="paino" ref={ref} />
    </div>
  );
}
