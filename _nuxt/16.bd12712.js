(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{488:function(e){e.exports=JSON.parse('{"title":"Some GHC options for Mios","date":"2018-05-20T00:00:00.000Z","tags":["Haskell","Mios"],"bodyContent":"https://downloads.haskell.org/~ghc/latest/docs/html/users_guide/runtime_control.html#rts-options-to-control-the-garbage-collector\\n\\n```\\n-A ⟨size⟩\\n    Default:\\t1MB\\n    \\n    Set the allocation area size used by the garbage collector. The allocation area (actually\\n    generation 0 step 0) is fixed and is never resized (unless you use -H [⟨size⟩], below).\\n\\n    Increasing the allocation area size may or may not give better performance (a bigger allocation\\n    area means worse cache behaviour but fewer garbage collections and less promotion).\\n\\n    With only 1 generation (e.g. -G1, see -G ⟨generations⟩) the -A option specifies the minimum\\n    allocation area, since the actual size of the allocation area will be resized according to the\\n    amount of data in the heap (see -F ⟨factor⟩, below).\\n\\n-M ⟨size⟩\\n    Default:\\tunlimited\\n    Set the maximum heap size to ⟨size⟩ bytes. The heap normally grows and shrinks according to the\\n    memory requirements of the program. The only reason for having this option is to stop the heap\\n    growing without bound and filling up all the available swap space, which at the least will\\n    result in the program being summarily killed by the operating system.\\n\\n    The maximum heap size also affects other garbage collection parameters: when the amount of live\\n    data in the heap exceeds a certain fraction of the maximum heap size, compacting collection will\\n    be automatically enabled for the oldest generation, and the -F parameter will be reduced in\\n    order to avoid exceeding the maximum heap size.\\n```","bodyHtml":"<p>https://downloads.haskell.org/~ghc/latest/docs/html/users_guide/runtime_control.html#rts-options-to-control-the-garbage-collector</p>\\n<pre><code>-A ⟨size⟩\\n    Default:\\t1MB\\n    \\n    Set the allocation area size used by the garbage collector. The allocation area (actually\\n    generation 0 step 0) is fixed and is never resized (unless you use -H [⟨size⟩], below).\\n\\n    Increasing the allocation area size may or may not give better performance (a bigger allocation\\n    area means worse cache behaviour but fewer garbage collections and less promotion).\\n\\n    With only 1 generation (e.g. -G1, see -G ⟨generations⟩) the -A option specifies the minimum\\n    allocation area, since the actual size of the allocation area will be resized according to the\\n    amount of data in the heap (see -F ⟨factor⟩, below).\\n\\n-M ⟨size⟩\\n    Default:\\tunlimited\\n    Set the maximum heap size to ⟨size⟩ bytes. The heap normally grows and shrinks according to the\\n    memory requirements of the program. The only reason for having this option is to stop the heap\\n    growing without bound and filling up all the available swap space, which at the least will\\n    result in the program being summarily killed by the operating system.\\n\\n    The maximum heap size also affects other garbage collection parameters: when the amount of live\\n    data in the heap exceeds a certain fraction of the maximum heap size, compacting collection will\\n    be automatically enabled for the oldest generation, and the -F parameter will be reduced in\\n    order to avoid exceeding the maximum heap size.\\n</code></pre>\\n","dir":"article/.json/2018","base":"2018-05-20-ghc-options.json","ext":".json","sourceBase":"2018-05-20-ghc-options.md","sourceExt":".md"}')}}]);