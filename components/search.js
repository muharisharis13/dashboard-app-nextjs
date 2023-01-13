import { useFormContext } from "react-hook-form";

const Search = (props) => {
  const { btnSearch, register = () => null } = props;

  return (
    <form onSubmit={btnSearch} className="input-group input-group-merge">
      <button
        type="submit"
        className="input-group-text"
        id="basic-addon-search31"
      >
        <i className="bx bx-search"></i>
      </button>
      <input
        type="search"
        className="form-control"
        placeholder="Searh..."
        {...props}
        {...register("search")}
      />
    </form>
  );
};

export default Search;
