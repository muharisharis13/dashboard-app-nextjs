import { useFormContext } from "react-hook-form";

const Search = (props) => {
  const { btnSearch } = props;
  const { register, handleSubmit } = useFormContext();

  return (
    <form onSubmit={handleSubmit(btnSearch)} className="input-group input-group-merge">
      <button
        type="submit"
        className="input-group-text"
        id="basic-addon-search31"
      >
        <i className="bx bx-search"></i>
      </button>
      <input
        type="text"
        className="form-control"
        placeholder="Searh..."
        {...props}
        {...register("search")}
      />
    </form>
  );
};

export default Search;
