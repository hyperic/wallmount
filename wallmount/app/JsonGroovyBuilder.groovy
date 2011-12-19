/**
 * NOTE: This copyright does *not* cover user programs that use HQ
 * program services by normal system calls through the application
 * program interfaces provided as part of the Hyperic Plug-in Development
 * Kit or the Hyperic Client Development Kit - this is merely considered
 * normal use of the program, and does *not* fall under the heading of
 *  "derived work".
 *
 *  Copyright (C) [2011], VMware, Inc.
 *  This file is part of HQ.
 *
 *  HQ is free software; you can redistribute it and/or modify
 *  it under the terms version 2 of the GNU General Public License as
 *  published by the Free Software Foundation. This program is distributed
 *  in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 *  even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 *  PARTICULAR PURPOSE. See the GNU General Public License for more
 *  details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 *  USA.
 *
 */

import groovy.lang.Closure
import groovy.lang.GString
import groovy.lang.GroovyObjectSupport
import groovy.lang.MissingMethodException

import java.util.HashMap
import java.util.Iterator
import java.util.List
import java.util.Map
import java.util.Stack
import java.io.Serializable

import org.json.JSONArray
import org.json.JSONObject


/**
 * 
 */
public class JsonGroovyBuilder extends GroovyObjectSupport {

    private static final String JSON = "json";
    private Object current;
    private Map properties;
    
    private Stack stack;

    /**
     * 
     */
    public JsonGroovyBuilder() {
        stack = new Stack()
        properties = new HashMap()
    }

    /**
     * 
     */
    public Object getProperty( String name ) {
        if(!stack.isEmpty()) {
            Object top = stack.peek()
            if(top instanceof JSONObject) {
                JSONObject json = (JSONObject)top
                if(json.has(name)) {
                    return json.get(name)
                } else {
                    return _getProperty(name)
                }
            } else {
                return _getProperty(name)
            }
        } else {
            return _getProperty(name)
        }
    }

    /**
     * Invokes the given method.
     *
     * @param name the name of the method to call
     * @param arg the arguments to use for the method call
     * @return the result of invoking the method
     */
    public Object invokeMethod(String name, Object arg) {

        if(Serializable.equals(name) && stack.isEmpty()){
            return createObject(name, arg)
        }

        Object[] args = (Object[])arg
        if(args.length == 0){
            throw new MissingMethodException(name, getClass(), args)
        }

        Object value = null
        if(args.length > 1){
            JSONArray array = new JSONArray()
            stack.push(array)
            for(int i = 0; i < args.length; i++) {
                if(args[i] instanceof Closure) {
                    append(name, createObject((Closure) args[i]))
                } else if (args[i] instanceof Map) {
                    append(name, createObject((Map) args[i]))
                } else if (args[i] instanceof List ) {
                    append(name, createArray((List) args[i]))
                } else {
                    _append(name, args[i], (Object) stack.peek())
                }
            }
            stack.pop();
        } else {
            if(args[0] instanceof Closure) {
                value = createObject((Closure) args[0])
            } else if (args[0] instanceof Map ) {
                value = createObject((Map) args[0])
            } else if (args[0] instanceof List) {
                value = createArray((List) args[0])
            }
        }

        if(stack.isEmpty()){
            JSONObject object = new JSONObject()
            object.accumulate(name, current != null ? current : value)
            current = object
        } else {
            Object top = (Object) stack.peek()
            if(top instanceof JSONObject){
                append(name, current == null ? value : current)
            }
        }

        // this is very dodgy
        if(name == 'call')
            return current.getJSONObject('call')
        else
            return current;
    }

    /**
     * 
     */
    public void setProperty(String name, Object value) {
        if(value instanceof GString){
            value = value.toString()
            try{
                value = JSONSerializer.toJSON(value)
            } catch(Exception jsone){
                // its a String literal
            }
        } else if (value instanceof Closure) {
            value = createObject((Closure)value)
        } else if (value instanceof Map) {
            value = createObject((Map)value)
        } else if (value instanceof List) {
            value = createArray((List)value)
        }

        append(name, value);
    }

    /**
     * 
     */
    private Object _getProperty(String name) {
        if( properties.containsKey(name)) {
            return properties.get(name)
        } else {
            return super.getProperty(name)
        }
    }

    /**
     * 
     */
    private void append(String key, Object value) {
        Object target = null
        if(!stack.isEmpty()) {
            target = stack.peek()
            current = (Object)target
            _append(key, value, current)
        } else {
            properties.put(key, value)
        }
    }

    /**
     * 
     */
    private void _append(String key, Object value, Object target) {
        if(target instanceof JSONObject) {
            JSONObject _target = ((JSONObject)target)
            if(_target.has(key)) {
                _target.accumulate(key, value)
            } else {
                _target.put(key, value)
            }
        } else if (target instanceof JSONArray){
            ((JSONArray)target).put(value)
        }
    }

    /**
     * 
     */
    private Object createArray(List list) {
        JSONArray array = new JSONArray()
        stack.push(array)
        for(Iterator elements = list.iterator(); elements.hasNext();) {
            Object element = elements.next()
            if(element instanceof Closure){
                element = createObject( (Closure) element );
            } else if (element instanceof Map) {
                element = createObject((Map)element)
            } else if (element instanceof List){
                element = createArray((List)element)
            }
            array.put(element)
        }
        stack.pop()
        return array
    }

    /**
     * 
     */
    private Object createObject(Closure closure) {
        JSONObject object = new JSONObject()
        stack.push(object)
        closure.setDelegate(this)
        closure.setResolveStrategy(Closure.DELEGATE_FIRST)
        closure.call()
        stack.pop()
        return object
    }

    /**
     * 
     */
    private Object createObject(Map map) {
        JSONObject object = new JSONObject()
        stack.push(object)
        for( Iterator properties = map.entrySet()
        .iterator(); properties.hasNext(); ) {
            Map.Entry property = (Map.Entry)properties.next()
            String key = String.valueOf(property.getKey())
            Object value = property.getValue()
            if(value instanceof Closure){
                value = createObject((Closure)value)
            } else if (value instanceof Map) {
                value = createObject((Map)value)
            } else if (value instanceof List) {
                value = createArray((List)value)
            }
            object.put(key, value)
        }
        stack.pop()
        return object
    }

    /**
     * 
     */
    private Object createObject(String name, Object arg) {
        Object[] args = (Object[])arg
        if(args.length == 0){
            throw new MissingMethodException( name, getClass(), args )
        }

        if(args.length == 1){
            if(args[0] instanceof Closure) {
                return createObject((Closure)args[0])
            } else if (args[0] instanceof Map ) {
                return createObject((Map)args[0])
            } else if (args[0] instanceof List) {
                return createArray((List)args[0])
            } else {
                throw new Exception( "Unsupported type" )
            }
        } else {
            JSONArray array = new JSONArray()
            stack.push(array)
            for( int i = 0; i < args.length; i++ ){
                if(args[i] instanceof Closure) {
                    append(name, createObject((Closure)args[i]))
                } else if (args[i] instanceof Map ){
                    append(name, createObject((Map)args[i]))
                } else if (args[i] instanceof List ){
                    append(name, createArray((List)args[i]))
                } else {
                    _append(name, args[i], (Object)stack.peek())
                }
            }
            stack.pop()
            return array
        }
    }
}