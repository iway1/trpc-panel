import React from "react";

export function LoadingSpinner() {
    return (
        <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center">
            <span className="lds-dual-ring w-6 h-6" />
            <style>
                {`
.lds-dual-ring {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 1.2rem;
  height: 1.2rem;
  
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`}
            </style>
        </div>
    );
}
