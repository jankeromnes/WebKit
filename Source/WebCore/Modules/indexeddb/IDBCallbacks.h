/*
 * Copyright (C) 2010 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#ifndef IDBCallbacks_h
#define IDBCallbacks_h

#include "DOMStringList.h"
#include "IDBDatabaseError.h"
#include "IDBKey.h"
#include "IDBKeyPath.h"
#include "SerializedScriptValue.h"
#include <wtf/Threading.h>

#if ENABLE(INDEXED_DATABASE)

namespace WebCore {
class IDBCursorBackendInterface;
class IDBDatabaseBackendInterface;
class IDBObjectStoreBackendInterface;
class IDBTransactionBackendInterface;

// FIXME: All child classes need to be made threadsafe.
class IDBCallbacks : public ThreadSafeRefCounted<IDBCallbacks> {
public:
    virtual ~IDBCallbacks() { }

    virtual void onError(PassRefPtr<IDBDatabaseError>) = 0;
    virtual void onSuccess(PassRefPtr<DOMStringList>) = 0;
    virtual void onSuccess(PassRefPtr<IDBCursorBackendInterface>) = 0;
    virtual void onSuccess(PassRefPtr<IDBDatabaseBackendInterface>) = 0;
    virtual void onSuccess(PassRefPtr<IDBKey>) = 0;
    virtual void onSuccess(PassRefPtr<IDBTransactionBackendInterface>) = 0;
    virtual void onSuccess(PassRefPtr<SerializedScriptValue>) = 0;
    virtual void onSuccess(PassRefPtr<SerializedScriptValue>, PassRefPtr<IDBKey>, const IDBKeyPath&) = 0;
    virtual void onSuccessWithContinuation() = 0;
    virtual void onSuccessWithPrefetch(const Vector<RefPtr<IDBKey> >& keys, const Vector<RefPtr<IDBKey> >& primaryKeys, const Vector<RefPtr<SerializedScriptValue> >& values) = 0;
    virtual void onBlocked() = 0;
};

} // namespace WebCore

#endif

#endif // IDBCallbacks_h
