function Button({children, handler}) {
  return (
    <button className="btn btn-ui" onClick={handler}>
        {children}
    </button>
  );
}

export default  Button;