# node-tags

Given a set of tags, it finds the frequency of those tags. If no tags are specified then it uses a pre-specified tags
present under source/tags.txt

## Requirements

Following are the requirements:

> 1. allow the user to supply a CLI argument containing a comma-separated list of tags
> 2. if no argument is given, load `tags.txt` to get an array of tags.
> 3. for each of these tags, find out how many times that tag appears within the objects in `data/*.json` (_note:_ objects can be nested).
> 4. final output should be sorted by most popular tag first
> 5. cache the result so that subsequent runs can return the result immediately without needing to process the files.
> 6. use only core modules
> 7. use the asynchronous variants of the file IO functions (eg. use `fs.readFile` not `fs.readFileSync`).
> 8. if any of the data files contain invalid JSON, log the error with `console.error` and continue, ignoring that file.
> 9. you can use any version of node, however your solution must use plain callbacks rather than promises.

## Clone the repository

The code for node tags as well as all the tests have been pushed to git. It can be cloned using following:

```bash
$ git clone https://github.com/luthraG/node-tags.git
```

#### Issue tracking
To track the the issues, enhancements, bugs, new requirements we can use:

```bash
$ https://github.com/luthraG/node-tags/issues
```

## Unit tests

This library has bunch of unit tests for all the methods that are important in findinding the tags.<br />
We are using mocha as unit test runner and chai as assertion library.<br />

#### Tests Execution
1. Install dev dependencies from project root directory

```bash
$ npm install
```

2. Run tests
```bash
$ npm test
```

## Usage

To find the frequency of the tags run the program by providing tags as CLI options. The tags should be specified after **-t** option and should be comman separated. Note that the separator between the tags is comma(not anything else say space). 

```bash
$ npm start -- -t pizza,spoon
```

*Notice the -- after start and before specifiying the -t option*

Alternatively, if you don't want to use the npm start command then you can run it using following command:

```bash
$ node source/driver.js -t pizza,spoon
```

In case size of all data files is more than default heap size of nodeJS i.e. 1.78G for 64 bit machine, use 

### CLI Options

Following are various command line switch that are supported:

| CLI Option    | Description   | Default Value  |
|:-------------:|:------------- |:----- |
| t      | use -t option to specify list of comma separated tags | if no tags are specified then it uses tags present under source/tags.txt |
| i      | To do a case in-sensitive tags search | it defaults to false i.e. vcase sensitive search |
| c      | To specify the path of configuration file | it defaults to conf/appConf.js |


## Examples

#### When user specified two tags and both are present

```bash
$ npm start -- -t amet,sit
```

It would print

```javascript
sit     31283
amet    31273
```

#### When user specified multiple tags and all are present

```bash
$ npm start -- -t amet,sit,Lorem,gaurav
```

It would print

```javascript
sit         31283
amet        31273
Lorem       30879
gaurav      1
```

#### When user specified multiple tags and not all are present

```bash
$ npm start -- -t amet,sit,lorem,gaurav
```

It would print

```javascript
sit         31283
amet        31273
gaurav      1
lorem       0
```

#### When user specified two tags and both of those are not present

```bash
$ npm start -- -t AMET,SIT
```

It would print

```javascript
AMET        0
SIT         0
```

#### When user specified two tags and both of those are present when searched in case insensitive manner

```bash
$ npm start -- -t AMET,SIT -i
```

It would print

```javascript
SIT         31283
AMET        31273
```

#### When user specified did not specify any tag

```bash
$ npm start
```

It would print as it uses default tags

```javascript
sit         31283
amet        31273
dolor       31209
ipsum       31116
lorem       0
```

#### When user specified did not specify any tag and used -i flag

```bash
$ npm start -- -i
```

It would print as it uses default tags but notice the tag lorem with/without -i flag

```javascript
sit         31283
amet        31273
dolor       31209
ipsum       31116
lorem       30879

```

#### When user specified spaces between tags and comma after first tag

```bash
$ npm start -- -t sit, amet
```

It would print this as it uses only first tag i.e. sit

```javascript
sit     31283
```

#### When user specified spaces between tags and no comma between the tags

```bash
$ npm start -- -t sit amet
```

It would print this as it uses only first tag i.e. sit

```javascript
sit     31283
```

#### When user specified same tag multiple times and tag is present

It will print it only once as this seems better than duplicating the results

```bash
$ npm start -- -t amet,amet
```

It would print

```javascript
amet        31273
```

## Implementation Notes

1. It prepares a dictionary for look up so that tags frequency can be checked in O(1) 
2. In-memory Caching is used for fast retrival of results for subsequent runs
3. Only async versions of methods are used as per requirement
4. Cache is updated if there is any kind of change in data file(s)
5. Specify --max-old-space-size while running the program if size of data files is more than default heap size of node(based on architecture of your system i.e. 32 bit or 64 bit)
6. Only core modules have been used
7. It is tested with nested object, very large files with millions of tags to measure efficiency of tags
8. For unit testing, mocha has been used as test runner and chai has been used as assertion library
9. If user specifies a tag value multiple times(with tag name in same case) then we will print it only once, see example above.
10. There is extensive logging with different levels. Based on requirement most of statements are in debug mode. To enable those, go to config file and update LOGGER object to set VERBOSE to true

### License(MIT)

```
Copyright (c) 2017 Gaurav Luthra(luthra.zenith@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
