import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

const Pagination = ({ pagination, onPageChange }) => {
    const total = pagination?.total || 0;
    const currentPage = pagination?.current_page || 1;
    const lastPage = pagination?.last_page || 1;
    const [jump, setJump] = useState(currentPage);

    useEffect(() => {
        setJump(currentPage);
    }, [currentPage]);

    const goFirst = () => {
        if (currentPage > 1) {
            onPageChange(1);
        }
    };

    const goPrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const goNext = () => {
        if (currentPage < lastPage) {
            onPageChange(currentPage + 1);
        }
    };

    const goLast = () => {
        if (currentPage < lastPage) {
            onPageChange(lastPage);
        }
    };

    const handleChange = (e) => {
        // only digit allow
        const value = e.target.value.replace(/[^0-9]/g, "");
        setJump(value);
    };

    const handleJump = (e) => {
        if (e.key === "Enter") {
            let pageNumber = Number(jump) || 1;

            if (pageNumber < 1) {
                pageNumber = 1;
            }
            if (pageNumber > lastPage) {
                pageNumber = lastPage;
            }

            onPageChange(pageNumber);
        }
    };

    if (total === 0) {
        return null;
    }

    return (
        <div className="flex justify-center items-center mt-8">
        {/*<div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-8">*/}
            {/*<p className="text-sm text-gray-600">{total} items</p>*/}

            <div className="flex items-center gap-1">
                <button className="btn btn-sm" onClick={goFirst} disabled={currentPage === 1}>
                    <FaAnglesLeft /> First
                </button>

                <button className="btn btn-sm" onClick={goPrev} disabled={currentPage === 1}>
                    <FaChevronLeft />  Prev
                </button>

                <input
                    type="text"
                    className="input input-bordered input-sm w-20 text-center"
                    value={jump}
                    onChange={handleChange}
                    onKeyDown={handleJump}
                />

                <span className="mx-1 text-sm">of {lastPage}</span>

                <button className="btn btn-sm" onClick={goNext} disabled={currentPage === lastPage}>
                    Next <FaChevronRight />
                </button>

                <button className="btn btn-sm" onClick={goLast} disabled={currentPage === lastPage}>
                    Last <FaAnglesRight />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
