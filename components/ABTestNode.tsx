import { memo, useState } from "react";
import { Position } from "@xyflow/react";
import { LabeledHandle } from "@/components/labeled-handle";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
} from "@/components/base-node";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NodeAppendix } from "@/components/NodeAppendix";
import SettingsIcon from "@/components/icons/SettingsIcon";
import { TestTubeDiagonalIcon, XIcon } from "lucide-react";

const ABTestNode = memo(function ABTestNode({
  title,
  target,
  onOutputEdgesChange,
}: {
  title: string;
  target: string;
  onOutputEdgesChange?: (count: number) => void;
}) {
  const [appendixVisible, setAppendixVisible] = useState(false);
  const [outputEdges, setOutputEdges] = useState(2);
  const [inputValue, setInputValue] = useState("2");
  const [errorMessage, setErrorMessage] = useState("");

  const validateInput = (value: string): string => {
    if (value === "") {
      return "Please enter a number";
    }
    if (!/^\d+$/.test(value)) {
      return "Only numbers are allowed";
    }
    const numValue = parseInt(value);
    if (numValue < 1) {
      return "Minimum value is 1";
    }
    if (numValue > 10) {
      return "Maximum value is 10";
    }
    return "";
  };

  const handleTempOutputEdgesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setInputValue(value);

    const error = validateInput(value);
    setErrorMessage(error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateInput(inputValue);
    if (error) {
      setErrorMessage(error);
      return;
    }

    const numValue = parseInt(inputValue);
    setOutputEdges(numValue);
    setAppendixVisible(false);

    if (onOutputEdgesChange) {
      onOutputEdgesChange(numValue);
    }
  };

  const openConfiguration = () => {
    setInputValue(outputEdges.toString());
    setErrorMessage("");
    setAppendixVisible(true);
  };

  return (
    <BaseNode className="relative max-w-[600px] min-w-[200px] border-2 border-dotted border-purple-500 bg-purple-50/70 ring-0 backdrop-blur-sm transition-all hover:border-solid">
      {appendixVisible && (
        <NodeAppendix position="bottom" className="w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">A/B Test Configuration</h4>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 size-6 rounded-sm border drop-shadow-sm"
              onClick={() => setAppendixVisible(false)}
            >
              <XIcon className="size-3" />
            </Button>
            <div className="flex flex-col gap-2">
              <label htmlFor="output-edges" className="text-xs font-medium">
                Number of A/B test variants:
              </label>
              <Input
                id="output-edges"
                type="text"
                value={inputValue}
                onChange={handleTempOutputEdgesChange}
                className={`w-full pr-10 ${errorMessage ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="Enter 1-10"
              />
              {errorMessage && (
                <div className="mt-1 text-xs text-red-500">{errorMessage}</div>
              )}
            </div>
            <div className="text-muted-foreground text-xs">
              Set the number of A/B test variants to generate.
              <br />
              Enter a value between 1 and 10.
            </div>
            <Button
              type="submit"
              size="sm"
              className="w-full"
              disabled={!!errorMessage}
            >
              Apply Changes
            </Button>
          </form>
        </NodeAppendix>
      )}

      <LabeledHandle
        id={target}
        title="Input"
        type="target"
        position={Position.Top}
        handleClassName="!absolute !-top-1 !left-1/2 !-translate-x-1/2 !-translate-y-1/2"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
        labelClassName="sr-only"
      />

      <LabeledHandle
        id={`${target}-output`}
        title="Output"
        type="source"
        position={Position.Bottom}
        className="pointer-events-auto absolute bottom-[-10px] left-[49%]"
        labelClassName="sr-only"
      />

      <BaseNodeHeader>
        <BaseNodeHeaderTitle className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full border border-purple-200 bg-purple-100">
            <TestTubeDiagonalIcon className="size-5 fill-purple-100 text-purple-800" />
          </div>
          <span className="text-sm font-semibold">
            {title} ({outputEdges})
          </span>
        </BaseNodeHeaderTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={openConfiguration}
          className="h-6 w-6 rounded-sm border drop-shadow-sm"
        >
          <SettingsIcon className="h-4 w-4 text-blue-700" />
        </Button>
      </BaseNodeHeader>

      <BaseNodeContent>
        <div className="flex flex-col items-start gap-0.5">
          <div className="text-xs font-medium">
            <span className="font-semibold">{outputEdges}</span> variant
            {outputEdges !== 1 ? "s" : ""} can be tested.
          </div>
          <div className="text-muted-foreground text-xs">
            To change the number of variants, click the settings{" "}
            <SettingsIcon className="inline h-4 w-4 text-blue-700" /> button.
          </div>
        </div>
      </BaseNodeContent>
    </BaseNode>
  );
});

export default ABTestNode;
