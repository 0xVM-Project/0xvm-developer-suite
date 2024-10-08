// automatically generated by the FlatBuffers compiler, do not modify

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import * as flatbuffers from 'flatbuffers';

import { Data } from './data';


export class Transaction {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):Transaction {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsTransaction(bb:flatbuffers.ByteBuffer, obj?:Transaction):Transaction {
  return (obj || new Transaction()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsTransaction(bb:flatbuffers.ByteBuffer, obj?:Transaction):Transaction {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new Transaction()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

content(index: number, obj?:Data):Data|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? (obj || new Data()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

contentLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

static startTransaction(builder:flatbuffers.Builder) {
  builder.startObject(1);
}

static addContent(builder:flatbuffers.Builder, contentOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, contentOffset, 0);
}

static createContentVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startContentVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static endTransaction(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static finishTransactionBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset);
}

static finishSizePrefixedTransactionBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset, undefined, true);
}

static createTransaction(builder:flatbuffers.Builder, contentOffset:flatbuffers.Offset):flatbuffers.Offset {
  Transaction.startTransaction(builder);
  Transaction.addContent(builder, contentOffset);
  return Transaction.endTransaction(builder);
}
}
