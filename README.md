## Parallel coordinates visualization tool based on D3.js
This project contains the interactive visualization code for the data evaluated in the following paper:

- "A. Artuñedo, J. Godoy and J. Villagra, "A Primitive Comparison for Traffic-Free Path Planning," in IEEE Access, vol. 6, pp. 28801-28817, 2018, doi: [10.1109/ACCESS.2018.2839884](https://ieeexplore.ieee.org/document/8364535)."

The tool allows to select the scenario, the metric used to define the line colours and the percentile of the cases to be visualized. 
Moreover, the data can be filtered by stating a region of interest for each of the axis.
At the bottom, a table containing the resulting cases after filtering is shown.

The dataset is hosted at IEEE Dataport:

- "A. Artuñedo, May 21, 2018, "Results of a comparison of traffic-free path planning primitives", IEEE Dataport, doi: [10.21227/H2W373](https://dx.doi.org/10.21227/H2W373)."

This dataset must be available in the folder `/data` to be property loaded.

This tool is available online at the [AUTOPIA web page](https://autopia.car.upm-csic.es/antonio/comparison_results.html).


Visualization example:

![Example image](https://autopia.car.upm-csic.es/antonio/capture.png)
***
Graphics library used: [D3.js](https://d3js.org/)