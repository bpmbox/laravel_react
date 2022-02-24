import omit from 'lodash/omit';
import React, { FunctionComponent } from 'react';
import { ItemProps } from '../../../UIKit/Item';
import Code from '../../../UIKit/items/Code';

type BlockProps = {
    value: string;
    attrs?: {
        lang?: 'bash' | 'basic' | 'c' | 'clojure' | 'coffeescript' | 'cpp' | 'cs' | 'css' | 'dart' | 'elixir' | 'erlang' | 'fortran' | 'fs' | 'go' | 'graphql' | 'groovy' | 'haskell' | 'html' | 'java' | 'js' | 'json' | 'kotlin' | 'latex' | 'less' | 'list' | 'lua' | 'makefile' | 'markdown' | 'matlab' | 'objc' | 'ocaml' | 'pascal' | 'perl' | 'php' | 'plain' | 'prolog' | 'python' | 'r' | 'ruby' | 'rust' | 'sass' | 'scala' | 'scheme' | 'scss' | 'shell' | 'sql' | 'swift' | 'typescript' | 'r' | 'vhdl' | 'visualbasic' | 'xml' | 'yaml';
    },
} & ItemProps;

const Block: FunctionComponent<BlockProps> = (props) => {
    let extraProps = {}
    if (props.attrs) {
        extraProps = { [props.attrs.lang as string]: true }
    }

    return (
        <>
            <Code
                text={props.value}
                textSelectable
                {...extraProps}
                {...omit(props, 'value', 'attrs')} />
        </>
    );
};

export default Block;
