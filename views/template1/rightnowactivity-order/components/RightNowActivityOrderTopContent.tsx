"use client";
import { memo, useEffect, useState } from "react";
import { Icon } from "@iconify/react";

/**
 * 即刻快閃單 訂單詳情上方
 */

const RightNowActivityOrderTopContent = memo(({ lng, values, setValues, customClass, showButton }: { lng: string; values?: { label: string; value: string; column: string }[] | void; setValues?: Function | void; customClass?: string | void; showButton: boolean }) => {
    const [showDetailContent, setShowDetailContent] = useState(false);

    return (
        <div className={`${customClass}`}>
            <ul>
                {values
                    ? values.map((data) => {
                          return data.column !== "column-note" ? (
                              <li
                                  key={data.column}
                                  className="flex mt-[15px]"
                              >
                                  <span className="text-gray-primary text-lg-content font-bold flex-1">{data.label}</span>
                                  <span className="text-gray-primary text-lg-content">{data.value}</span>
                              </li>
                          ) : showButton ? (
                              <li
                                  key={data.column}
                                  className="flex flex-col mt-[15px]"
                              >
                                  <button
                                      type="button"
                                      className={`${showDetailContent ? "" : "rotate-180"} mx-auto text-2xl duration-500 transition-all`}
                                      onClick={() => setShowDetailContent(!showDetailContent)}
                                  >
                                      <Icon icon="iconamoon:arrow-down-2-duotone" />
                                  </button>
                                  {showDetailContent ? (
                                      <div className={`${showDetailContent ? "visible" : "hidden"} transition-all duration-500 mt-5`}>
                                          <div className="text-gray-primary text-lg-content font-bold flex-1">{data.label}</div>
                                          <div className="text-gray-primary text-lg-content mt-[15px]">{data.value}</div>
                                      </div>
                                  ) : null}
                              </li>
                          ) : (
                              <li
                                  key={data.column}
                                  className="flex flex-col mt-[15px]"
                              >
                                  <div className="">
                                      <div className="text-gray-primary text-lg-content font-bold flex-1">{data.label}</div>
                                      <div className="text-gray-primary text-lg-content mt-[15px]">{data.value}</div>
                                  </div>
                              </li>
                          );
                      })
                    : null}
            </ul>
        </div>
    );
});

export default RightNowActivityOrderTopContent;
