import React from "react";
// import { useSearchApiQuery } from "../../RTK/slices/API/uTubeApiSlice";
// import useDebounceApi from "../../hooks/useDebounce";

interface IRespSearch {
  showSearch: boolean;
  inputValue: string;
  setInputValue: (props: string) => void;
  searchRef: React.RefObject<HTMLDivElement>;
}

const RespSearch: React.FC<IRespSearch> = ({
  showSearch,
  inputValue,
  setInputValue,

  searchRef,
}) => {
  // const debounceInput = useDebounce(inputValue);
  // const { data: debouncdData, status } = useSearchApiQuery(debounceInput);

  return (
    <div
      className={`${
        showSearch ? "translate-y-0" : "-translate-y-full"
      } ease-in-out duration-500 fixed right-0 top-0 w-full  `}
    >
      <div className="bg-black bg-opacity-70 h-screen ">
        {/* INPUT SECTION */}
        <div
          ref={searchRef}
          className="flex flex-col justify-center items-center py-6 gap-y-3 bg-cyan-300 dark:bg-zinc-700 dark:text-slate-200 "
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.trim())}
            type="text"
            placeholder="search ...."
            autoFocus
            className="ring-1 ring-slate-300 outline-none  px-3 py-1 w-[200px] duration-150 placeholder:text-slate-400 rounded-full text-slate-600 "
          />
          {/* -------- SEARCH RESULT OPTIONS DIV -------- */}
          {status === "fulfilled" && (
            <div className=" dark:text-zinc-900 ">
              {/* {data?.products.map((singleProduct, index) => {
              return (
                <div
                  key={singleProduct?.id}
                  onClick={() => handleSelectSearchResult(singleProduct)}
                  className={`${
                    index % 2 !== 0 ? "bg-slate-300" : "bg-slate-200"
                  } py-1 px-5 cursor-pointer `}
                >
                  {" "}
                  <p> {singleProduct?.title} </p>{" "}
                </div>
              );
            })} */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RespSearch;
