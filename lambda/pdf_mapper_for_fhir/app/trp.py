# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the "Software"), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
# the Software, and to permit persons to whom the Software is furnished to do so.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
# FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
# COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
# IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
# CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

class BoundingBox:
    def __init__(self, width, height, left, top):
        self._width = width
        self._height = height
        self._left = left
        self._top = top

    def __str__(self):
        return "width: {}, height: {}, left: {}, top: {}".format(self._width, self._height, self._left, self._top)

    @property
    def width(self):
        return self._width

    @property
    def height(self):
        return self._height

    @property
    def left(self):
        return self._left

    @property
    def top(self):
        return self._top


class Polygon:
    def __init__(self, x, y):
        self._x = x
        self._y = y

    def __str__(self):
        return "x: {}, y: {}".format(self._x, self._y)

    @property
    def x(self):
        return self._x

    @property
    def y(self):
        return self._y


class Geometry:
    def __init__(self, geometry):
        bounding_box = geometry["BoundingBox"]
        polygon = geometry["Polygon"]
        bb = BoundingBox(bounding_box["Width"], bounding_box["Height"], bounding_box["Left"], bounding_box["Top"])
        pgs = []
        for pg in polygon:
            pgs.append(Polygon(pg["X"], pg["Y"]))

        self._bounding_box = bb
        self._polygon = pgs

    def __str__(self):
        s = "BoundingBox: {}\n".format(str(self._bounding_box))
        return s

    @property
    def bounding_box(self):
        return self._bounding_box

    @property
    def polygon(self):
        return self._polygon


class Word:
    def __init__(self, block, block_map):
        self._block = block
        self._confidence = block['Confidence']
        self._geometry = Geometry(block['Geometry'])
        self._id = block['Id']
        self._text = ""
        if block['Text']:
            self._text = block['Text']

    def __str__(self):
        return self._text

    @property
    def confidence(self):
        return self._confidence

    @property
    def geometry(self):
        return self._geometry

    @property
    def id(self):
        return self._id

    @property
    def text(self):
        return self._text

    @property
    def block(self):
        return self._block


class Line:
    def __init__(self, block, block_map):

        self._block = block
        self._confidence = block['Confidence']
        self._geometry = Geometry(block['Geometry'])
        self._id = block['Id']

        self._text = ""
        if block['Text']:
            self._text = block['Text']

        self._words = []
        if 'Relationships' in block and block['Relationships']:
            for rs in block['Relationships']:
                if rs['Type'] == 'CHILD':
                    for cid in rs['Ids']:
                        if cid not in block_map:
                            continue
                        if block_map[cid]["BlockType"] == "WORD":
                            self._words.append(Word(block_map[cid], block_map))

    def __str__(self):
        s = "Line\n==========\n"
        s = s + self._text + "\n"
        s = s + "Words\n----------\n"
        for word in self._words:
            s = s + "[{}]".format(str(word))
        return s

    @property
    def confidence(self):
        return self._confidence

    @property
    def geometry(self):
        return self._geometry

    @property
    def id(self):
        return self._id

    @property
    def words(self):
        return self._words

    @property
    def text(self):
        return self._text

    @property
    def block(self):
        return self._block


class SelectionElement:
    def __init__(self, block, block_map):
        self._confidence = block['Confidence']
        self._geometry = Geometry(block['Geometry'])
        self._id = block['Id']
        self._selectionStatus = block['SelectionStatus']

    @property
    def confidence(self):
        return self._confidence

    @property
    def geometry(self):
        return self._geometry

    @property
    def id(self):
        return self._id

    @property
    def selection_status(self):
        return self._selectionStatus


class FieldKey:
    def __init__(self, block, children, block_map):
        self._block = block
        self._confidence = block['Confidence']
        self._geometry = Geometry(block['Geometry'])
        self._id = block['Id']
        self._text = ""
        self._content = []

        t = []

        for eid in children:
            wb = block_map[eid]
            if wb['BlockType'] == "WORD":
                w = Word(wb, block_map)
                self._content.append(w)
                t.append(w.text)

        if t:
            self._text = ' '.join(t)

    def __str__(self):
        return self._text

    @property
    def confidence(self):
        return self._confidence

    @property
    def geometry(self):
        return self._geometry

    @property
    def id(self):
        return self._id

    @property
    def content(self):
        return self._content

    @property
    def text(self):
        return self._text

    @property
    def block(self):
        return self._block


class FieldValue:
    def __init__(self, block, children, block_map):
        self._block = block
        self._confidence = block['Confidence']
        self._geometry = Geometry(block['Geometry'])
        self._id = block['Id']
        self._text = ""
        self._content = []

        t = []

        for eid in children:
            wb = block_map[eid]
            if wb['BlockType'] == "WORD":
                w = Word(wb, block_map)
                self._content.append(w)
                t.append(w.text)
            elif wb['BlockType'] == "SELECTION_ELEMENT":
                se = SelectionElement(wb, block_map)
                self._content.append(se)
                self._text = se.selection_status

        if t:
            self._text = ' '.join(t)

    def __str__(self):
        return self._text

    @property
    def confidence(self):
        return self._confidence

    @property
    def geometry(self):
        return self._geometry

    @property
    def id(self):
        return self._id

    @property
    def content(self):
        return self._content

    @property
    def text(self):
        return self._text

    @property
    def block(self):
        return self._block


class Field:
    def __init__(self, block, block_map):
        self._key = None
        self._value = None

        for item in block['Relationships']:
            if item["Type"] == "CHILD":
                self._key = FieldKey(block, item['Ids'], block_map)
            elif item["Type"] == "VALUE":
                for eid in item['Ids']:
                    vkvs = block_map[eid]
                    if 'VALUE' in vkvs['EntityTypes']:
                        if 'Relationships' in vkvs:
                            for v_item in vkvs['Relationships']:
                                if v_item["Type"] == "CHILD":
                                    self._value = FieldValue(vkvs, v_item['Ids'], block_map)

    def __str__(self):
        s = "\nField\n==========\n"
        k = ""
        v = ""
        if self._key:
            k = str(self._key)
        if self._value:
            v = str(self._value)
        s = s + "Key: {}\nValue: {}".format(k, v)
        return s

    @property
    def key(self):
        return self._key

    @property
    def value(self):
        return self._value


class Form:
    def __init__(self):
        self._fields = []
        self._fields_map = {}

    def add_field(self, field):
        self._fields.append(field)
        self._fields_map[field.key.text] = field

    def __str__(self):
        s = ""
        for field in self._fields:
            s = s + str(field) + "\n"
        return s

    @property
    def fields(self):
        return self._fields

    def get_field_by_key(self, key):
        field = None
        if key in self._fields_map:
            field = self._fields_map[key]
        return field

    def search_fields_by_key(self, key):
        search_key = key.lower()
        results = []
        for field in self._fields:
            if field.key and search_key in field.key.text.lower():
                results.append(field)
        return results


class Cell:

    def __init__(self, block, block_map):
        self._block = block
        self._confidence = block['Confidence']
        self._rowIndex = block['RowIndex']
        self._columnIndex = block['ColumnIndex']
        self._rowSpan = block['RowSpan']
        self._columnSpan = block['ColumnSpan']
        self._geometry = Geometry(block['Geometry'])
        self._id = block['Id']
        self._content = []
        self._text = ""
        if 'Relationships' in block and block['Relationships']:
            for rs in block['Relationships']:
                if rs['Type'] == 'CHILD':
                    for cid in rs['Ids']:
                        block_type = block_map[cid]["BlockType"]
                        if block_type == "WORD":
                            w = Word(block_map[cid], block_map)
                            self._content.append(w)
                            self._text = self._text + w.text + ' '
                        elif block_type == "SELECTION_ELEMENT":
                            se = SelectionElement(block_map[cid], block_map)
                            self._content.append(se)
                            self._text = self._text + se.selection_status + ', '

    def __str__(self):
        return self._text

    @property
    def confidence(self):
        return self._confidence

    @property
    def row_index(self):
        return self._rowIndex

    @property
    def column_index(self):
        return self._columnIndex

    @property
    def row_span(self):
        return self._rowSpan

    @property
    def column_span(self):
        return self._columnSpan

    @property
    def geometry(self):
        return self._geometry

    @property
    def id(self):
        return self._id

    @property
    def content(self):
        return self._content

    @property
    def text(self):
        return self._text

    @property
    def block(self):
        return self._block


class Row:
    def __init__(self):
        self._cells = []

    def __str__(self):
        s = ""
        for cell in self._cells:
            s = s + "[{}]".format(str(cell))
        return s

    @property
    def cells(self):
        return self._cells


class Table:

    def __init__(self, block, block_map):

        self._block = block

        self._confidence = block['Confidence']
        self._geometry = Geometry(block['Geometry'])

        self._id = block['Id']
        self._rows = []

        ri = 1
        row = Row()
        if 'Relationships' in block and block['Relationships']:
            for rs in block['Relationships']:
                if rs['Type'] == 'CHILD':
                    for cid in rs['Ids']:
                        cell = Cell(block_map[cid], block_map)
                        if cell.row_index > ri:
                            self._rows.append(row)
                            row = Row()
                            ri = cell.row_index
                        row.cells.append(cell)
                    if row and row.cells:
                        self._rows.append(row)

    def __str__(self):
        s = "Table\n==========\n"
        for row in self._rows:
            s = s + "Row\n==========\n"
            s = s + str(row) + "\n"
        return s

    @property
    def confidence(self):
        return self._confidence

    @property
    def geometry(self):
        return self._geometry

    @property
    def id(self):
        return self._id

    @property
    def rows(self):
        return self._rows

    @property
    def block(self):
        return self._block


class Page:

    def __init__(self, blocks, block_map):
        self._blocks = blocks
        self._text = ""
        self._lines = []
        self._form = Form()
        self._tables = []
        self._selection_element = []
        self._content = []
        self._orientation = True

        self._parse(block_map)

    def __str__(self):
        s = "Page\n==========\n"
        for item in self._content:
            s = s + str(item) + "\n"
        return s

    def _parse(self, block_map):
        for item in self._blocks:
            if item["BlockType"] == "PAGE":
                self._geometry = Geometry(item['Geometry'])
                self._id = item['Id']
                self._orientation = item['Orientation']
            elif item["BlockType"] == "LINE":
                line_item = Line(item, block_map)
                self._lines.append(line_item)
                self._content.append(line_item)
                self._text = self._text + line_item.text + '\n'
            elif item["BlockType"] == "TABLE":
                table_item = Table(item, block_map)
                self._tables.append(table_item)
                self._content.append(table_item)
            elif item["BlockType"] == "SELECTION_ELEMENT":
                selection_item = SelectionElement(item, block_map)
                self._selection_element.append(selection_item)
                self._content.append(selection_item)
            elif item["BlockType"] == "KEY_VALUE_SET":
                if 'KEY' in item['EntityTypes']:
                    f = Field(item, block_map)
                    if f.key:
                        self._form.add_field(f)
                        self._content.append(f)
                    else:
                        print("WARNING: Detected K/V where key does not have content. Excluding key from output.")
                        print(f)
                        print(item)

    def get_lines_in_reading_order(self):
        columns = []
        lines = []
        for item in self._lines:
            column_found = False
            for index, column in enumerate(columns):
                bbox_left = item.geometry.bounding_box.left
                bbox_right = item.geometry.bounding_box.left + item.geometry.bounding_box.width
                bbox_centre = item.geometry.bounding_box.left + item.geometry.bounding_box.width / 2
                column_centre = column['left'] + column['right'] / 2
                if column['left'] < bbox_centre < column['right'] or bbox_left < column_centre < bbox_right:
                    # Bbox appears inside the column
                    lines.append([index, item])
                    column_found = True
                    break
            if not column_found:
                columns.append({'left': item.geometry.bounding_box.left,
                                'right': item.geometry.bounding_box.left + item.geometry.bounding_box.width})
                lines.append([len(columns) - 1, item])

        lines.sort(key=lambda x: x[0])
        return lines

    def get_text_in_reading_order(self):
        lines = self.get_lines_in_reading_order()
        text = ""
        for line in lines:
            text = text + line[1] + '\n'
        return text

    @property
    def blocks(self):
        return self._blocks

    @property
    def text(self):
        return self._text

    @property
    def lines(self):
        return self._lines

    @property
    def form(self):
        return self._form

    @property
    def tables(self):
        return self._tables

    @property
    def selections(self):
        return self._selection_element

    @property
    def content(self):
        return self._content

    @property
    def geometry(self):
        return self._geometry

    @property
    def id(self):
        return self._id

    @property
    def orientation(self):
        return self._orientation


class Document:

    def __init__(self, response_pages):

        if not isinstance(response_pages, list):
            rps = [response_pages]
            response_pages = rps

        self._responsePages = response_pages
        self._pages = []

        self._parse()

    def __str__(self):
        s = "\nDocument\n==========\n"
        for p in self._pages:
            s = s + str(p) + "\n\n"
        return s

    def _parse_document_pages_and_block_map(self):

        block_map = {}

        document_pages = []
        document_page = None
        for page in self._responsePages:
            for block in page['Blocks']:
                if 'BlockType' in block and 'Id' in block:
                    block_map[block['Id']] = block

                if block['BlockType'] == 'PAGE':
                    if block['Geometry']['Polygon'][0]['X'] > block['Geometry']['Polygon'][1]['X']:
                        block['Orientation'] = False
                    else:
                        block['Orientation'] = True
                    if document_page:
                        document_pages.append({"Blocks": document_page})
                    document_page = [block]
                else:
                    if document_page:
                        document_page.append(block)
        if document_page:
            document_pages.append({"Blocks": document_page})
        return document_pages, block_map

    def _parse(self):

        self._response_document_pages, self._block_map = self._parse_document_pages_and_block_map()
        for documentPage in self._response_document_pages:
            page = Page(documentPage["Blocks"], self._block_map)
            self._pages.append(page)

    @property
    def blocks(self):
        return self._responsePages

    @property
    def page_blocks(self):
        return self._response_document_pages

    @property
    def pages(self):
        return self._pages

    def get_block_by_id(self, block_id):
        block = None
        if self._block_map and block_id in self._block_map:
            block = self._block_map[block_id]
        return block
