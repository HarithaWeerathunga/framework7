import React, { forwardRef, useRef, useImperativeHandle, useLayoutEffect } from 'react';
import { classNames, getDataAttrs, emit } from '../shared/utils';
import { colorClasses } from '../shared/mixins';

import Preloader from './preloader';
import { useTab } from '../shared/use-tab';
import { f7ready, f7 } from '../shared/f7';

/* dts-props
  id?: string | number;
  className?: string;
  style?: React.CSSProperties;
  tab? : boolean
  tabActive? : boolean
  ptr? : boolean
  ptrDistance? : number
  ptrPreloader? : boolean
  ptrBottom? : boolean
  ptrMousewheel? : boolean
  infinite? : boolean
  infiniteTop? : boolean
  infiniteDistance? : number
  infinitePreloader? : boolean
  hideBarsOnScroll? : boolean
  hideNavbarOnScroll? : boolean
  hideToolbarOnScroll? : boolean
  messagesContent? : boolean
  loginScreen? : boolean
  COLOR_PROPS
  onPtrPullStart? : (...args: any[]) => void
  onPtrPullMove? : (...args: any[]) => void
  onPtrPullEnd? : (...args: any[]) => void
  onPtrRefresh? : (done?: any) => void
  onPtrDone? : (...args: any[]) => void
  onInfinite? : (...args: any[]) => void
  onTabShow? : (el?: HTMLElement) => void
  onTabHide? : (el?: HTMLElement) => void
*/

const PageContent = forwardRef((props, ref) => {
  const {
    className,
    id,
    style,
    children,
    tab,
    tabActive,
    ptr,
    ptrDistance,
    ptrPreloader = true,
    ptrBottom,
    ptrMousewheel,
    infinite,
    infiniteTop,
    infiniteDistance,
    infinitePreloader = true,
    hideBarsOnScroll,
    hideNavbarOnScroll,
    hideToolbarOnScroll,
    messagesContent,
    loginScreen,
  } = props;

  const dataAttrs = getDataAttrs(props);

  const elRef = useRef(null);

  const onPtrPullStart = (el) => {
    if (elRef.current !== el) return;
    emit(props, 'ptrPullStart');
  };
  const onPtrPullMove = (el) => {
    if (elRef.current !== el) return;
    emit(props, 'ptrPullMove');
  };
  const onPtrPullEnd = (el) => {
    if (elRef.current !== el) return;
    emit(props, 'ptrPullEnd');
  };
  const onPtrRefresh = (el, done) => {
    if (elRef.current !== el) return;
    emit(props, 'ptrRefresh', done);
  };
  const onPtrDone = (el) => {
    if (elRef.current !== el) return;
    emit(props, 'ptrDone');
  };
  const onInfinite = (el) => {
    if (elRef.current !== el) return;
    emit(props, 'infinite');
  };

  useImperativeHandle(ref, () => ({
    el: elRef.current,
  }));

  useTab(elRef, props);

  const onMount = () => {
    f7ready(() => {
      if (ptr) {
        f7.on('ptrPullStart', onPtrPullStart);
        f7.on('ptrPullMove', onPtrPullMove);
        f7.on('ptrPullEnd', onPtrPullEnd);
        f7.on('ptrRefresh', onPtrRefresh);
        f7.on('ptrDone', onPtrDone);
      }
      if (infinite) {
        f7.on('infinite', onInfinite);
      }
    });
  };

  const onDestroy = () => {
    if (!f7) return;
    f7.off('ptrPullStart', onPtrPullStart);
    f7.off('ptrPullMove', onPtrPullMove);
    f7.off('ptrPullEnd', onPtrPullEnd);
    f7.off('ptrRefresh', onPtrRefresh);
    f7.off('ptrDone', onPtrDone);
    f7.off('infinite', onInfinite);
  };

  useLayoutEffect(() => {
    onMount();
    return onDestroy;
  }, []);

  let ptrEl;
  let infiniteEl;

  if (ptr && ptrPreloader) {
    ptrEl = (
      <div className="ptr-preloader">
        <Preloader />
        <div className="ptr-arrow" />
      </div>
    );
  }
  if (infinite && infinitePreloader) {
    infiniteEl = <Preloader className="infinite-scroll-preloader" />;
  }

  const classes = classNames(
    className,
    'page-content',
    {
      tab,
      'tab-active': tabActive,
      'ptr-content': ptr,
      'ptr-bottom': ptrBottom,
      'infinite-scroll-content': infinite,
      'infinite-scroll-top': infiniteTop,
      'hide-bars-on-scroll': hideBarsOnScroll,
      'hide-navbar-on-scroll': hideNavbarOnScroll,
      'hide-toolbar-on-scroll': hideToolbarOnScroll,
      'messages-content': messagesContent,
      'login-screen-content': loginScreen,
    },
    colorClasses(props),
  );

  return (
    <div
      id={id}
      style={style}
      className={classes}
      data-ptr-distance={ptrDistance || undefined}
      data-ptr-mousewheel={ptrMousewheel || undefined}
      data-infinite-distance={infiniteDistance || undefined}
      ref={elRef}
      {...dataAttrs}
    >
      {ptrBottom ? null : ptrEl}
      {infiniteTop ? infiniteEl : null}
      {children}
      {infiniteTop ? null : infiniteEl}
      {ptrBottom ? ptrEl : null}
    </div>
  );
});

PageContent.displayName = 'f7-page-content';

export default PageContent;