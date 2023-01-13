import { useWatch } from "react-hook-form";

const Loading = () => {
  const loading = useWatch({
    name: "loading",
  });

  return (
    <div
      show={loading.toString()}
      style={{
        display: loading ? "flex" : "none",
        width: "100%",
        height: "100vh",
        position: "fixed",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        top: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.2)",
        zIndex: "99999",
      }}
    >
      <div className="demo-inline-spacing">
        <div className="spinner-grow" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
