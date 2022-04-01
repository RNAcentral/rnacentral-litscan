# RNAcentral LitScan

RNAcentral LitScan is a new text mining pipeline that connects RNA sequences with the latest open access scientific 
literature. LitScan uses a collection of identifiers (Ids), gene names, and synonyms provided to RNAcentral by the 
[Expert Databases](https://rnacentral.org/expert-databases) to scan the papers available in [Europe PMC](https://europepmc.org) 
and keep the publications linked to RNAcentral entries as up-to-date as possible.

The LitScan widget is implemented as an embeddable component that can be used by any Expert Database or any other 
website. This plugin is written in React/Redux.

## How to use

To use the latest stable version without worrying about updates, use the component's javascript package available at 
Github:

`<script type="text/javascript" src="https://rnacentral.github.io/rnacentral-litscan/dist/rnacentral-litscan.js"></script>`

If you prefer to install this package and perform the updates manually, see the [Installation](#Installation) section.

To use it just insert an html tag somewhere in your html:

```
<rnacentral-litscan search='["NEAT1"]' />
```

You can pass a list of ids, for example:

```
<rnacentral-litscan search='["RF00001", "RF00002", "RF00003"]' />
```

If the database parameter is used, the widget will get related ids:

```
<rnacentral-litscan search='["RF00001"]' database='{"name": "Rfam"}' />
```

The example above will list articles with keywords RF00001 and 5S_rRNA.

You can customise some elements of this embeddable component. See what you can change [here](#layout).
The example below changes the color of the links:

```
<rnacentral-litscan
    search='["NEAT1"]'
    customStyle='{
      "linkColor": "#000000"
    }'
/>
```

## Installation

Download this package directly from Github.

`git clone https://github.com/RNAcentral/rnacentral-litscan.git`

Now you can add the component's javascript bundle (it contains all the styles and fonts) to your web page either 
directly or through an import with Webpack:

`<script type="text/javascript" src="/rnacentral-litscan/dist/rnacentral-litscan.js"></script>`

You will need to run the `git pull` command whenever there are updates.

## Attributes/parameters

This component accepts a number of attributes. You pass them as html attributes and their values are strings 
(this is a requirement of Web Components):

#### layout

Parameters that you can use to customise some elements of this embeddable component

| parameter           | description                                                           |
|---------------------|-----------------------------------------------------------------------|
| fixCss              | fix the CSS. Use *"fixCss": "true"* if the button sizes are different |
| linkColor           | change the color of the links                                         |
| titleText           | change title text                                                     |
| titleColor          | change the color of the `Publications` text                           |
| titleSize           | change the size of the `Publications` text                            |
| facetColor          | change the color of the facet title                                   |
| facetSize           | change the size of the facet title                                    |
| articleTitleSize    | change the size of the article title                                  |
| loadMoreButtonColor | change the color of the `Load more` button                            |

## Developer details

### Local development

1. `npm install`
2. `npm run serve` to start a server on http://localhost:8080/
3. `npm run clean` to clean the dist folder of old assets
4. `npm run build` to generate a new distribution.

### Notes

This embed is implemented as a Web Component, wrapping a piece of code in React/Redux.

Being a Web Component, it isolates CSS styles from the main page to avoid clash of styles with it.
The CSS styles and fonts are bundled into the javascript inline via Webpack 5 build system,
see webpack.config.js file. Upon load of rnacentral-litscan.js, the component registers
itself in the custom elements registry.

Web Components accept input parameters as strings. That means that we have to parse
parameters in Web Component initialization code and pass the resulting objects as props to React.
Here are some examples of passing the parameters to the Web Component or from Web Component
to React:

* https://hackernoon.com/how-to-turn-react-component-into-native-web-component-84834315cb24
* https://stackoverflow.com/questions/50404970/web-components-pass-data-to-and-from/50416836