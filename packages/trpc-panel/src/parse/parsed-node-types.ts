import { ZodTypeDef } from "zod";
import { TrpcPanelExtraOptions } from "./parse-router";

type SharedInputNodeProperties = {
    path: (string | number)[];
};

type InputNodeTypes = ZodTypeDef;

export type ArrayNode = {
    type: "array";
    childType: ParsedInputNode;
} & SharedInputNodeProperties;

export type ObjectNode = {
    type: "object";
    children: { [name: string]: ParsedInputNode };
} & SharedInputNodeProperties;

export type EnumNode = {
    type: "enum";
    enumValues: string[];
} & SharedInputNodeProperties;

export type DiscriminatedUnionNode = {
    type: "discriminated-union";
    discriminatedUnionValues: string[];
    discriminatedUnionChildrenMap: {
        [value: string]: ParsedInputNode;
    };
    discriminatorName: string;
} & SharedInputNodeProperties;

export type LiteralNode = {
    type: "literal";
    value: string | boolean | number | bigint;
} & SharedInputNodeProperties;

export type StringNode = {
    type: "string";
} & SharedInputNodeProperties;

export type NumberNode = { type: "number" } & SharedInputNodeProperties;

export type BooleanNode = { type: "boolean" } & SharedInputNodeProperties;

export type UnsupportedNode = {
    type: "unsupported";
} & SharedInputNodeProperties;

export type ParsedInputNode =
    | ArrayNode
    | ObjectNode
    | EnumNode
    | DiscriminatedUnionNode
    | LiteralNode
    | StringNode
    | NumberNode
    | BooleanNode
    | UnsupportedNode;

export type ParseReferences = {
    path: string[];
    optional: boolean;
    // Doesn't do anything yet but maybe down the road we can extend with this
    options: TrpcPanelExtraOptions;
};

export type ParseFunction<
    InputNodeType extends InputNodeTypes,
    ParsedNodeType extends ParsedInputNode
> = (def: InputNodeType, references: ParseReferences) => ParsedNodeType;

export type ParserSelectorFunction<InputNodeType extends InputNodeTypes> = (
    inputNode: InputNodeType,
    references: ParseReferences
) => ParsedInputNode;
