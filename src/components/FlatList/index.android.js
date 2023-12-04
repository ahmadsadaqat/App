import {useFocusEffect} from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, {forwardRef, useCallback, useContext} from 'react';
import {FlatList} from 'react-native';
import {ActionListContext} from '@pages/home/ReportScreenContext';

const propTypes = {
    /** Same as for FlatList */
    onScroll: PropTypes.func,

    /** Same as for FlatList */
    onLayout: PropTypes.func,

    /** Same as for FlatList */
    // eslint-disable-next-line react/forbid-prop-types
    maintainVisibleContentPosition: PropTypes.object,

    /** Passed via forwardRef so we can access the FlatList ref */
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({current: PropTypes.instanceOf(FlatList)})]).isRequired,
};

const defaultProps = {
    /** Same as for FlatList */
    onScroll: undefined,

    /** Same as for FlatList */
    onLayout: undefined,

    /** Same as for FlatList */
    maintainVisibleContentPosition: undefined,
};

// FlatList wrapped with the freeze component will lose its scroll state when frozen (only for Android).
// CustomFlatList saves the offset and use it for scrollToOffset() when unfrozen.
function CustomFlatList(props) {
    const {scrollPosition, setScrollPosition} = useContext(ActionListContext);

    const onScreenFocus = useCallback(() => {
        if (!props.innerRef.current || !scrollPosition.offset) {
            return;
        }
        if (props.innerRef.current && scrollPosition.offset) {
            props.innerRef.current.scrollToOffset({offset: scrollPosition.offset, animated: false});
        }
    }, [scrollPosition.offset, props.innerRef]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onMomentumScrollEnd = useCallback((event) => setScrollPosition({offset: event.nativeEvent.contentOffset.y}), []);

    useFocusEffect(
        useCallback(() => {
            onScreenFocus();
        }, [onScreenFocus]),
    );

    return (
        <FlatList
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            onScroll={props.onScroll}
            onMomentumScrollEnd={onMomentumScrollEnd}
            ref={props.innerRef}
        />
    );
}

CustomFlatList.propTypes = propTypes;
CustomFlatList.defaultProps = defaultProps;

const CustomFlatListWithRef = forwardRef((props, ref) => (
    <CustomFlatList
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        innerRef={ref}
    />
));

CustomFlatListWithRef.displayName = 'CustomFlatListWithRef';

export default CustomFlatListWithRef;
