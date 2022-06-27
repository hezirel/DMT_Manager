let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/Dev/Work/DMT_manager/backend/node
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
set shortmess=aoO
badd +22 ~/Dev/Work/DMT_manager/backend/node/index.js
badd +43 ~/Dev/Work/DMT_manager/backend/node/app/models/Models.js
badd +19 ~/Dev/Work/DMT_manager/backend/node/app/services/Services.js
badd +32 ~/Dev/Work/DMT_manager/backend/node/app/controllers/Controllers.js
badd +12 ~/Dev/Work/DMT_manager/backend/node/app/routes/Routes.js
badd +1025 term://~/Dev/Work/DMT_manager/backend/node//28561:/bin/zsh
argglobal
%argdel
$argadd .
edit ~/Dev/Work/DMT_manager/backend/node/index.js
argglobal
balt term://~/Dev/Work/DMT_manager/backend/node//28561:/bin/zsh
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 13 - ((6 * winheight(0) + 8) / 16)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 13
normal! 09|
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
