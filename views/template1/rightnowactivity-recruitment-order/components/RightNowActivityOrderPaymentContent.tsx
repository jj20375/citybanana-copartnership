"use client";
import { memo, useEffect, useState } from "react";
/**
 * 即刻快閃單 付款資訊
 */

const RightNowActivityOrderPaymentContent = memo(({ lng, values, setValues, customClass }: { lng: string; values?: { label: string; value: string; column: string }[] | void; setValues?: Function | void; customClass?: string | void }) => {
    return (
        <div className={`${customClass}`}>
            <ul>
                {values
                    ? values.map((data, index) => {
                          return data.column !== "column-note" ? (
                              <li
                                  key={data.column}
                                  className={`${index === 0 ? "" : "mt-[15px]"} flex`}
                              >
                                  <span className="text-gray-primary text-lg-content font-bold flex-1">{data.label}</span>
                                  <span className="text-gray-primary text-lg-content">{data.value}</span>
                              </li>
                          ) : (
                              <li
                                  key={data.column}
                                  className="flex flex-col mt-[15px]"
                              >
                                  <div className="text-gray-primary text-lg-content font-bold flex-1">{data.label}</div>
                                  <div className="text-gray-primary text-lg-content mt-[15px]">{data.value}</div>
                              </li>
                          );
                      })
                    : null}
            </ul>
        </div>
    );
});

export default RightNowActivityOrderPaymentContent;
